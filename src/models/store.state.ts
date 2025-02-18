import { Provider } from "@angular/core";
import { DefaultActions } from "../shared/store.enums";
import { provideStoreStates } from "../shared/store.providers";
import { Service, ServiceClass } from "../shared/store.types";
import { MergeReducer } from "../variations/merge.reducer";
import { StorageReducer } from "../variations/storage.reducer";
import { StoreAction } from "./store.action";
import { StoreOptions } from "./store.options";
import { StoreReducer } from "./store.reducer";

const DefaultReducers = [StoreReducer, MergeReducer, StorageReducer];

export class StoreState<M extends any = any, N extends string = string, S extends Service = Service, A extends any[] = any[], F extends string = string> {
  app?: string;
  name: N;
  initial: M;
  service: ServiceClass<S>;
  actions: A;
  fallback: F[] = [];
  options: StoreOptions;
  reducers: StoreReducer[] = [];

  constructor(state?: Partial<StoreState<M, N, S, A, F>>, autoExtend = true) {
    this.app = state?.app;
    this.name = !state || typeof (state) === 'string' ? state as any : state.name;
    this.initial = state?.initial || {} as M;
    this.service = state?.service as ServiceClass<S>;
    this.fallback = state?.fallback || [] as F[];
    this.options = state?.options || {};
    this.reducers = state?.reducers || [];
    this.actions = state?.actions as A || [];

    if (this.service) {
      Object.getOwnPropertyNames(this.service.prototype)
        .forEach(key => {
          const isFunction = key !== 'constructor' && typeof this.service.prototype[key] === 'function';
          const name = key.split(/(?=[A-Z])/).join('_').toUpperCase();
          const isNew = !this.actions.find(x => x.name == name);
          if (isFunction && isNew) {
            const action = new StoreAction({
              name,
              service: this.service,
              method: key as any
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
      state = reducer.onPopulate(this as any, state, action as StoreAction);
    });
    this.reducers?.forEach(reducer => {
      state = reducer.postPopulate(this as any, state, action as StoreAction);
    });
    return state;
  }

  provideState(): Provider[] {
    return provideStoreStates([this], { app: this.app })
  }
}
