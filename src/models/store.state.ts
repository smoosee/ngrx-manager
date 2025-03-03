import { DefaultActions } from "../shared/store.enums";
import { Service, ServiceClass, ServiceMethod } from "../shared/store.types";
import { toCase } from "../shared/store.utils";
import { MergeReducer } from "../variations/merge.reducer";
import { StorageReducer } from "../variations/storage.reducer";
import { StoreAction } from "./store.action";
import { StoreOptions } from "./store.options";
import { StoreReducer } from "./store.reducer";

const DefaultReducers = [StoreReducer, MergeReducer, StorageReducer];

export interface IStoreState<N extends string = string, M extends any = any, S extends Service = Service, A extends any[] = any[]> {
  name: N;
  initial: M;
  service?: ServiceClass<S>;
  actions?: A;
}

export class StoreState<N extends string = string, M extends any = any, S extends Service = Service, A extends any[] = any[]> {
  name!: N;
  app?: string;

  initial: M;
  service!: ServiceClass<S>;
  actions: A;
  options: StoreOptions;
  reducers: StoreReducer[] = [];

  constructor(state?: Partial<StoreState<N, M, S, A>>) {
    this.app = state?.app;
    this.name = !state || typeof (state) === 'string' ? state as any : state.name;
    this.initial = state?.initial || {} as M;
    this.service = state?.service as ServiceClass<S>;
    this.options = state?.options || {};
    this.reducers = state?.reducers || [];
    this.actions = state?.actions as A || [];

    if (this.service) {
      Object.getOwnPropertyNames(this.service.prototype)
        .forEach(key => {
          const isFunction = key !== 'constructor' && typeof this.service.prototype[key] === 'function';
          const name = toCase(key, 'snake').toUpperCase();
          const isNew = !this.actions.find(x => x.name == name);
          if (isFunction && isNew) {
            const service = this.service;
            const method = key as ServiceMethod<S>;
            const action = new StoreAction({
              name,
              service,
              method
            }, this.name);
            this.actions.push(action);
          }
        });
    }


    Object.keys(DefaultActions).forEach(action => {
      if (!this.actions.find(x => x.name == action)) {
        this.actions.push(new StoreAction(action as any, this.name) as any);
      }
    });

    DefaultReducers.forEach(reducer => {
      if (!this.reducers.find(x => x instanceof reducer)) {
        this.reducers.push(new reducer());
      }
    });

  }

  update(state: any, action: StoreAction): M {
    this.reducers?.forEach(reducer => {
      state = reducer.prePopulate(this as any, state, action as StoreAction);
    });
    this.reducers?.forEach(reducer => {
      if (this.name === action.state) {
        state = reducer.onPopulate(this as any, state, action as StoreAction);
      }
    });
    this.reducers?.forEach(reducer => {
      state = reducer.postPopulate(this as any, state, action as StoreAction);
    });
    return state;
  }
}

