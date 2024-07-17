import { InjectionToken, Provider } from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { StoreOptions } from "../models/store.options";
import { StoreState } from "../models/store.state";
import { StoreDispatcher } from "../services/store.dispatcher";
import { StoreEffects } from "../services/store.effects";
import { NgrxStoreDispatcher } from "../variations/ngrx.dispatcher";


export const STORE_OPTIONS = new InjectionToken<StoreOptions>('STORE_OPTIONS');
export const STORE_STATES = new InjectionToken<StoreState[]>('STORE_STATES');

export const provideStoreOptions = (options: StoreOptions) => {
  return [
    { provide: STORE_OPTIONS, useValue: options },
    { provide: StoreDispatcher, useClass: NgrxStoreDispatcher },
  ];
};

export const provideStoreStates = (states: readonly StoreState[], options?: StoreOptions): Provider[] => {
  states.forEach(state => state.options = { ...options, ...state.options });
  return [options?.effects, { provide: STORE_STATES, useValue: states, multi: true }].filter(Boolean);
};

export const provideStoreForRoot = (options: StoreOptions, states: readonly StoreState[]) => {
  return [
    //
    provideStoreOptions(options),
    provideStoreStates(states, options),
    provideStore({}),
    provideEffects(StoreEffects),
  ]
}

