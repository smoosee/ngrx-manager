import {
  Injectable,
  Injector,
  inject
} from '@angular/core';
import { STORE_OPTIONS } from 'package';
import {
  StateAction,
  StateConfig,
  StoreOptions
} from '../models';
import { GenericReducer, StorageReducer } from '../reducers';
import { SignalsActions } from './actions.service';
import { SignalsStore } from './store.service';

@Injectable({ providedIn: 'root' })
export class SignalsManager {
  injector = inject(Injector);
  store = inject(SignalsStore);
  actions = inject(SignalsActions);

  state = new StateConfig<any>();

  constructor() { }

  initialize(states: StateConfig<any>[], options?: StoreOptions) {
    states.flat(Number.MAX_VALUE).forEach((config) => {
      this.addState(config, options);
    });
  }

  addState<T>(state: string): SignalsManager;
  addState<T>(state: StateConfig<T>, options?: StoreOptions): SignalsManager;


  addState<T>(...args: any[]) {
    const options = args[1] || this.injector.get(STORE_OPTIONS, {}) as StoreOptions;
    this.state = new StateConfig<T>(args[0]);

    this.state.options = { ...options, ...this.state.options };
    this.state.reducers = [GenericReducer, ...(this.state.reducers || [])];
    if (['session', 'local'].includes(options.storage as string)) {
      this.state.reducers.push(StorageReducer);
    }

    this.store.add(this.state);

    this.state.actions.forEach((action: StateAction) => this.addAction(action));

    return this;
  }

  addAction(action: StateAction) {
    this.actions.add(action.state || this.state.name, action);
    return this;
  }

}
