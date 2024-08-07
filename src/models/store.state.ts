import { Provider } from "@angular/core";
import { DefaultActions } from "../shared/store.enums";
import { provideStoreStates } from "../shared/store.providers";
import { MergeReducer } from "../variations/merge.reducer";
import { StorageReducer } from "../variations/storage.reducer";
import { StoreAction } from "./store.action";
import { StoreOptions } from "./store.options";
import { StoreReducer } from "./store.reducer";

const DefaultReducers = [StoreReducer, MergeReducer, StorageReducer];

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
    this.reducers = state?.reducers || [];
    this.actions = state?.actions as A || [];

    Object.keys(DefaultActions).forEach(action => {
      if (!this.actions.find(x => x.name == action)) {
        this.actions.push(new StoreAction(action as any, this.name));
      }
    });

    DefaultReducers.forEach(reducer => {
      if (!this.reducers.find(x => x instanceof reducer)) {
        this.reducers.push(new reducer());
      }
    });

  }

  update(state: any, action: StoreAction): T {
    return this.reducers?.reduce((result, reducer) => {
      return reducer.mapReduce(this as any, result, action as StoreAction);
    }, { ...state });
  }

  provideState(): Provider[] {
    return provideStoreStates([this], { app: this.app })
  }

  private addAction() {

  }
  private addReducer(reducer: any) {
    if (!this.reducers.find(x => x instanceof reducer)) {
      this.reducers.push(new reducer());
    }

  }
}
