import { Injectable, Signal, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { SignalsActions } from './actions.service';
import { ActionStatus } from '../models';
import { SignalsStore } from './store.service';
import { SignalsManager } from './manager.service';


@Injectable({ providedIn: 'root' })
export class SignalsFacade<StateKey extends string = any, StateData extends Record<StateKey, any> = any> {
  cache: any = {};
  returnType: 'signal' | 'observable' = 'signal';

  manager = inject(SignalsManager);
  store = inject(SignalsStore);
  actions = inject(SignalsActions);


  constructor() {
    this.manager.initialize();
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

  dispatch<T extends StateKey>(stateKey: T, actionKey: string, payload?: Partial<StateData[T]>) {
    const action = this.actions.dispatch(stateKey as string, actionKey, payload);
    return this.store.observable(stateKey as string, action);
  }

  get<T extends StateKey>(stateKey: T): Observable<StateData[T]> {
    return this.select(stateKey, true) as Observable<StateData[T]>;
  }

  set<T extends StateKey>(stateKey: T, payload?: Partial<StateData[T]>) {
    return this.dispatch(stateKey, ActionStatus.SET, payload);
  }

  extend<T extends StateKey>(stateKey: T, payload?: Partial<StateData[T]>) {
    return this.dispatch(stateKey, ActionStatus.EXTEND, payload);
  }

  unset<T extends StateKey>(stateKey: T) {
    return this.dispatch(stateKey, ActionStatus.UNSET);
  }

  init<T extends StateKey>(stateKey: T, getter: Observable<StateData[T]>, formatter: (data: any) => StateData[T], force = false) {
    formatter = formatter || ((data: StateData[T]) => data);
    if (this.isEmpty(stateKey) || force) {
      return firstValueFrom(getter).then((data) => {
        this.set(stateKey, { ...formatter(data), cached: false });
      });
    } else {
      return firstValueFrom(this.set(stateKey, { cached: true } as StateData[T]));
    }
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

  private isEmpty<T extends StateKey>(stateKey: T) {
    return Object.keys(this.select<T>(stateKey)).length > 0;
  }
}
