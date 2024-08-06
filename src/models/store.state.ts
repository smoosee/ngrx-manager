import { Provider } from "@angular/core";
import { DefaultActions } from "../shared/store.enums";
import { provideStoreStates } from "../shared/store.providers";
import { MergeReducer } from "../variations/merge.reducer";
import { StorageReducer } from "../variations/storage.reducer";
import { StoreAction } from "./store.action";
import { StoreOptions } from "./store.options";
import { StoreReducer } from "./store.reducer";


export class StoreState<T extends any = any, A extends any[] = any[], K extends string = string, F extends string = string> {
  app?: string;
  name: K;
  initial: T;
  actions: A;
  fallback: F[] = [];
  options: StoreOptions;
  reducers: StoreReducer[] = [];

  constructor(state?: Partial<StoreState<T, A, K, F>>, withBuiltinReducers = true) {
    this.app = state?.app;
    this.name = !state || typeof (state) === 'string' ? state as any : state.name;
    this.initial = state?.initial || {} as T;
    this.fallback = state?.fallback || [] as F[];
    const defaultActions = Object.keys(DefaultActions);
    this.actions = [...(state?.actions || []), ...defaultActions].map(untypedAction => new StoreAction(untypedAction as any, this.name)) as A;

    this.options = state?.options || {};

    const reducers = state?.reducers || [];
    StoreReducer.add(this, withBuiltinReducers);
    MergeReducer.add(this, withBuiltinReducers);
    this.reducers.push(...reducers);
    const allowStorage = this.options.storage && this.options.storage !== 'none';
    StorageReducer.add(this, withBuiltinReducers && allowStorage);
  }

  update(state: any, action: StoreAction): T {
    return this.reducers?.reduce((result, reducer) => {
      return reducer.mapReduce(this as any, result, action as StoreAction);
    }, { ...state });
  }

  provideState(): Provider[] {
    return provideStoreStates([this], { app: this.app })
  }
}
