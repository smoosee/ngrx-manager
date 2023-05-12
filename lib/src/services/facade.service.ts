import { Injectable, Signal, inject } from '@angular/core';
import { Observable, firstValueFrom, switchMap, of } from 'rxjs';
import { DefaultActions } from '../signals.const';
import { mergeDeep } from '../signals.utils';
import { SignalsManager } from './manager.service';
import { SignalsStore } from './store.service';
import { isEmpty } from 'lodash-es';


@Injectable({ providedIn: 'root' })
export class SignalsFacade<StateKey extends string = any, StateData extends Record<StateKey, any> = any> {
  cache: any = {};
  returnType: 'signal' | 'observable' = 'signal';

  manager = inject(SignalsManager);
  store = inject(SignalsStore);


  constructor() {
    this.manager.initialize();
  }

  selectAsync<T extends StateKey>(stateKey: T): Observable<StateData[T]> {
    return this.select(stateKey, true);
  }

  select<T extends StateKey>(stateKey: T): StateData[T];
  select<T extends StateKey>(stateKey: T, async: false): Signal<StateData[T]>;
  select<T extends StateKey>(stateKey: T, async: true): Observable<StateData[T]>;
  select<T extends StateKey>(stateKey: string, async: boolean | null = null) {
    if (async === null) {
      return this.store.value(stateKey);
    } else if (async) {
      return this.store.observable(stateKey);
    } else {
      return this.store.signal<T>(stateKey);
    }
  }

  dispatch<T extends StateKey>(stateKey: T, actionKey: string): Observable<StateData[T]>;
  dispatch<T extends StateKey>(stateKey: T, actionKey: string, payload?: string): Observable<StateData[T]>;
  dispatch<T extends StateKey>(stateKey: T, actionKey: string, payload?: Partial<StateData[T]>): Observable<StateData[T]>;
  dispatch<T extends StateKey>(stateKey: T, actionKey: string, payload?: string | Partial<StateData[T]>) {
    const action = this.store.dispatch(stateKey as string, actionKey, payload);
    return this.store.observable(stateKey as string, action);
  }

  get<T extends StateKey>(stateKey: T): Observable<StateData[T]> {
    return this.dispatch(stateKey, DefaultActions.GET);
  }

  set<T extends StateKey>(stateKey: T, payload: Partial<StateData[T]>) {
    return this.dispatch(stateKey, DefaultActions.SET, payload);
  }


  extend<T extends StateKey>(stateKey: T, payload: Partial<StateData[T]>): Promise<StateData[T]>;
  extend<T extends StateKey>(stateKey: T, getter: Observable<any>, key: string): Promise<StateData[T]>;
  extend<T extends StateKey>(stateKey: T, getter: Observable<any>, key: string, formatter: (data: any) => StateData[T]): Promise<StateData[T]>;

  extend<T extends StateKey>(stateKey: T, ...args: any[]) {
    return firstValueFrom(this.extendAsync(stateKey, ...args));
  }
  extendAsync<T extends StateKey>(stateKey: T, ...args: any[]) {
    const payload = args[0];
    const getter = payload instanceof Observable ? payload : of(payload);
    const key = args[1];
    const formatter = args[2] || ((data: StateData[T]) => data);

    return getter.pipe(switchMap((payload) => {
      let stateData = this.select(stateKey);
      if (key) {
        stateData[key] = mergeDeep(stateData[key], payload);
      } else {
        stateData = mergeDeep(stateData, payload);
      }
      return this.dispatch(stateKey, DefaultActions.EXTEND, formatter(stateData));
    }));
  }

  unset<T extends StateKey>(stateKey: T) {
    return this.dispatch(stateKey, DefaultActions.UNSET);
  }

  init<T extends StateKey>(stateKey: T, getter: Observable<StateData[T]>, formatter: (data: any) => StateData[T], force = false): Promise<StateData[T]> {
    return firstValueFrom(this.initAsync(stateKey, getter, formatter, force));
  }
  initAsync<T extends StateKey>(stateKey: T, getter: Observable<StateData[T]>, formatter: (data: any) => StateData[T], force = false): Observable<StateData[T]> {
    formatter = formatter || ((data: StateData[T]) => data);
    const stateData = this.select(stateKey);
    if (!isEmpty(stateData) && !force) {
      return of(stateData);
    }

    return getter.pipe(switchMap((data) => {
      return this.set(stateKey, formatter(data));
    }));
  }

  clear<T extends StateKey>(exclude: T[] = []) {
    Object.keys(this.store.states).forEach((stateKey) => {
      if (exclude.includes(stateKey as T)) {
        this.cache[stateKey as T] = this.select(stateKey as StateKey);
      } else {
        this.unset(stateKey as T);
      }
    });
  }

  restore() {
    Object.keys(this.cache).forEach((stateKey) => {
      this.set(stateKey as StateKey, this.cache[stateKey]);
      delete this.cache[stateKey];
    });
  }
}
