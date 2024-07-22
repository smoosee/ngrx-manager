import { Injectable, Injector, Signal, computed, inject } from '@angular/core';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Observable, distinctUntilKeyChanged, filter, map, take } from 'rxjs';
import { StoreAction } from '../models/store.action';
import { StoreOptions } from '../models/store.options';
import { StoreState } from '../models/store.state';
import { ActionStatus, StateKeys } from '../shared/store.enums';
import { STORE_OPTIONS, STORE_STATES } from '../shared/store.providers';
import { uniqueBy } from '../shared/store.utils';
import { StoreDispatcher } from './store.dispatcher';


@Injectable({ providedIn: 'root' })
export class StoreManager {
  dispatcher = inject(StoreDispatcher);
  storeOptions = inject(STORE_OPTIONS, { optional: true }) || {};
  storeStates = inject(STORE_STATES, { optional: true }) || [];

  injector = inject(Injector);
  store = inject(Store);

  constructor() {
    this.initialize();
  }

  initialize(): void;
  initialize(states: StoreState[], options?: StoreOptions): void;
  initialize(...args: any[]) {
    const states = (args?.[0] || this.storeStates) as StoreState[];
    const options = (args?.[1] || this.storeOptions) as StoreOptions;
    states.flat(Number.MAX_VALUE).forEach(config => {
      this.addState(config as StoreState, options);
    });
  }

  addState<T>(config: StoreState<T> | string, options?: StoreOptions) {
    if (typeof (config) === 'string') {
      config = new StoreState({ name: config });
    }

    config.options = new StoreOptions({ ...this.storeOptions, ...options, ...config.options });

    if (this.dispatcher.exists(config.name)) {
      config.actions = uniqueBy([...this.dispatcher.states[config.name].actions, ...config.actions], 'name');
    }

    const state = new StoreState<T>(config, this.injector);
    this.dispatcher.add(state);
    return this;
  }

  mapState(data: any = {}) {
    const {
      [StateKeys.uuid]: uuid,
      [StateKeys.status]: status,
      ...rest
    } = data;
    return rest;
  }

  getData<T extends 'signal' | 'observable'>(key: string, type: 'signal'): Signal<any>;
  getData<T extends 'signal' | 'observable'>(key: string, type: 'observable'): Observable<any>;
  getData<T extends 'signal' | 'observable'>(key: string, type: T) {
    const selector = createFeatureSelector(key);
    const store = this.injector.get(Store);
    const state = {
      signal: store.selectSignal(selector),
      observable: store.select(selector),
    };
    return state[type];
  }

  signal<T>(key: string): Signal<T> {
    const signal = this.getData(key, 'signal');
    return computed(() => this.mapState(signal && signal()));
  }

  value<T>(key: string): T {
    return this.signal(key)() as T;
  }

  observable<T>(key: string, action?: StoreAction): Observable<T> {
    let observable = this.getData(key, 'observable');
    return observable.pipe(
      filter((payload: any) => {
        const noAction = !action;
        const isSuccessful = payload?.[StateKeys.status] === ActionStatus.SUCCESS;
        const isSameAction = payload[StateKeys.uuid] === action?.uuid;
        return isSuccessful && (noAction || isSameAction);
      }),
      !!action ? take(1) : distinctUntilKeyChanged(StateKeys.uuid),
      map(data => this.mapState(data)),
    );
  }
}
