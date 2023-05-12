import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { StateAction, StateConfig, } from '../models';
import { GenericReducer, StorageReducer } from '../reducers';
import { STATE_CONFIG, STORE_OPTIONS, StoreOptions, StateConfigs } from '../signals.const';
import { SignalsStore } from './store.service';

@Injectable({ providedIn: 'root' })
export class SignalsManager {
  injector = inject(Injector);
  store = inject(SignalsStore);

  states = inject<StateConfigs>(STATE_CONFIG, { optional: true }) || [];
  options = inject<StoreOptions>(STORE_OPTIONS, { optional: true }) || {};

  state = new StateConfig<any>();

  constructor() { }

  initialize(): void;
  initialize(states: StateConfigs, options?: StoreOptions): void;
  initialize(...args: any[]) {
    runInInjectionContext(this.injector, () => {
      const states = (args?.[0] || this.states) as StateConfigs;
      const options = (args?.[1] || this.options) as StoreOptions;
      states.flat(Number.MAX_VALUE).forEach((config) => {
        this.addState(config as StateConfig<any>, options);
      });
    });
  }

  addState<T>(state: string): SignalsManager;
  addState<T>(state: StateConfig<T>, options?: StoreOptions): SignalsManager;
  addState<T>(...args: any[]) {
    runInInjectionContext(this.injector, () => {
      const options = args[1] || this.options || {};

      this.state = new StateConfig<T>(args[0]);

      this.state.options = { ...options, ...this.state.options };
      this.state.reducers = [GenericReducer, ...(this.state.reducers || [])];
      if (['session', 'local'].includes(options.storage as string)) {
        this.state.reducers.push(StorageReducer);
      }

      this.store.add(this.state);
    });
    return this;
  }
}
