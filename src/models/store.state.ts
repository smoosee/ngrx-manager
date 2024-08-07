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

  constructor(state?: Partial<StoreState<T, A, K, F>>, autoExtend = true) {
    this.app = state?.app;
    this.name = !state || typeof (state) === 'string' ? state as any : state.name;
    this.initial = state?.initial || {} as T;
    this.fallback = state?.fallback || [] as F[];
    this.options = state?.options || {};

    const actions: any[] = state?.actions || [];
    const reducers: any[] = state?.reducers || [];
    if (autoExtend) {
      actions.push(...Object.keys(DefaultActions));

      StoreReducer.add(this, 0);
      MergeReducer.add(this, 1);

      const withStorage = this.options.storage && this.options.storage !== 'none';
      if (withStorage) {
        StorageReducer.add(this);
      }
    }

    this.reducers = reducers;
    this.actions = actions.map(untypedAction => new StoreAction(untypedAction as any, this.name)) as A;

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
