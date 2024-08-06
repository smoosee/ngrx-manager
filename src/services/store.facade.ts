import { inject, Injectable, Signal } from '@angular/core';
import { exhaustMap, Observable, of } from 'rxjs';
import { StoreFlags } from '../models/store.options';
import { DefaultActions } from '../shared/store.enums';
import { ActionNames, DeepPartial, StateData, StateFormatter, StateKey } from '../shared/store.types';
import { isEmpty } from '../shared/store.utils';
import { StoreDispatcher } from './store.dispatcher';
import { StoreManager } from './store.manager';


@Injectable({ providedIn: 'root' })
export class StoreFacade<S extends readonly any[] = any, K extends string = StateKey<S>> {
  cache: any = {};

  manager = inject(StoreManager);
  dispatcher = inject(StoreDispatcher);

  constructor() { }

  selectAsync<T extends K>(stateKey: T): Observable<StateData<S, T>> {
    return this.select(stateKey, true);
  }

  select<T extends K>(stateKey: T): StateData<S, T>;
  select<T extends K>(stateKey: T, async: false): Signal<StateData<S, T>>;
  select<T extends K>(stateKey: T, async: true): Observable<StateData<S, T>>;
  select<T extends K>(stateKey: T, async: boolean | null = null) {
    if (async === null) {
      return this.manager.value(stateKey);
    } else if (async) {
      return this.manager.observable(stateKey);
    } else {
      return this.manager.signal<T>(stateKey);
    }
  }

  dispatch<T extends K, A extends ActionNames<S, T>>(stateKey: T, actionKey: A, payload?: string | number | boolean | DeepPartial<StateData<S, T>>, flags?: StoreFlags): Observable<StateData<S, T>> {
    const action = this.dispatcher.dispatch(stateKey, actionKey, payload, flags);
    return this.manager.observable(stateKey, action);
  }

  get<T extends K>(stateKey: T): Observable<StateData<S, T>> {
    return this.dispatch(stateKey, DefaultActions.GET);
  }

  set<T extends K>(stateKey: T, payload: DeepPartial<StateData<S, T>>, flags?: StoreFlags) {
    return this.dispatch(stateKey, DefaultActions.SET, payload, flags);
  }

  unset<T extends K>(stateKey: T) {
    return this.dispatch(stateKey, DefaultActions.UNSET);
  }

  extend<T extends K>(stateKey: T, payload: DeepPartial<StateData<S, T>>, flags?: StoreFlags) {
    return this.dispatch(stateKey, DefaultActions.EXTEND, payload, flags);
  }

  init<T extends K>(stateKey: T, getter: Observable<StateData<S, T>>, formatter: StateFormatter<S, T>, force = false): Observable<StateData<S, T>> {
    formatter = formatter || ((payload: StateData<S, T>) => payload);
    const stateData = this.select(stateKey);
    if (!isEmpty(stateData) && !force) {
      getter = of(stateData);
    }

    return getter.pipe(exhaustMap((payload: DeepPartial<StateData<S, T>>) => {
      return this.set(stateKey, formatter(payload));
    }));
  }

  clear<T extends K>(exclude: T[] = []) {
    Object.keys(this.dispatcher.states).forEach((stateKey) => {
      if (exclude.includes(stateKey as T)) {
        this.cache[stateKey as T] = this.select(stateKey as K);
      } else {
        this.unset(stateKey as T);
      }
    });
  }

  restore() {
    Object.keys(this.cache).forEach((stateKey) => {
      this.set(stateKey as K, this.cache[stateKey]);
      delete this.cache[stateKey];
    });
  }
}
