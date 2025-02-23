import { inject, Injectable, Signal } from '@angular/core';
import { exhaustMap, Observable, of } from 'rxjs';
import { UpdateFlag } from '../models/store.options';
import { IStoreState } from '../models/store.state';
import { DefaultActions } from '../shared/store.enums';
import { ActionKey, DeepPartial, DispatchArguments, DispatchResponse, State, StateActionNames, StateData, StateFormatter, StateKey } from '../shared/store.types';
import { isEmpty } from '../shared/store.utils';
import { StoreDispatcher } from './store.dispatcher';
import { StoreManager } from './store.manager';



@Injectable({ providedIn: 'root' })
export class StoreFacade<States extends readonly IStoreState[] = any, Keys extends string = StateKey<States>> {
  cache: any = {};

  manager = inject(StoreManager);
  dispatcher = inject(StoreDispatcher);

  selectAsync<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K): Observable<StateData<S>> {
    return this.select(stateKey, true);
  }

  select<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K): StateData<S>;
  select<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K, async: false): Signal<StateData<S>>;
  select<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K, async: true): Observable<StateData<S>>;
  select<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K, async: boolean | null = null) {
    if (async === null) {
      return this.manager.value(stateKey);
    } else if (async) {
      return this.manager.observable(stateKey);
    } else {
      return this.manager.signal<K>(stateKey);
    }
  }

  dispatch<K extends Keys, S extends IStoreState = State<States, K>, N extends string = StateActionNames<S>>(stateKey: K, actionKey: ActionKey<S, N>, ...[payload, flag]: DispatchArguments<S, N>): Observable<DispatchResponse<S, N>> {
    const action = this.dispatcher.dispatch(stateKey, actionKey, payload, flag);
    return this.manager.observable(stateKey, action);
  }

  get<K extends Keys>(stateKey: K) {
    return this.dispatch(stateKey, DefaultActions.GET);
  }

  set<K extends Keys, S extends State<States, K>>(stateKey: K, payload: DeepPartial<StateData<S>>, flag?: UpdateFlag) {
    return this.dispatch(stateKey, DefaultActions.SET, payload, flag);
  }

  unset<K extends Keys>(stateKey: K) {
    return this.dispatch(stateKey, DefaultActions.UNSET);
  }

  extend<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K, payload: DeepPartial<StateData<S>>, flag?: UpdateFlag) {
    return this.dispatch(stateKey, DefaultActions.EXTEND, payload, flag);
  }

  init<K extends Keys, S extends IStoreState = State<States, K>>(stateKey: K, getter: Observable<StateData<S>>, formatter: StateFormatter<S>, force = false) {
    formatter = formatter || ((payload: StateData<S>) => payload);
    const stateData = this.select(stateKey);
    if (!isEmpty(stateData) && !force) {
      getter = of(stateData);
    }

    return getter.pipe(exhaustMap((payload: DeepPartial<StateData<S>>) => {
      return this.set(stateKey, formatter(payload));
    }));
  }

  clear<K extends Keys>(exclude: K[] = []) {
    Object.keys(this.dispatcher.states).forEach((stateKey) => {
      if (exclude.includes(stateKey as K)) {
        this.cache[stateKey as K] = this.select(stateKey as Keys);
      } else {
        this.unset(stateKey as K);
      }
    });
  }

  restore() {
    Object.keys(this.cache).forEach((stateKey) => {
      this.set(stateKey as Keys, this.cache[stateKey]);
      delete this.cache[stateKey];
    });
  }
}

export { StoreFacade as _StoreFacade };

