import { InjectionToken } from "@angular/core";
import { StoreOptions } from "./const";
import { StoreState } from "../models";


export const STORE_OPTIONS = new InjectionToken<StoreOptions>('STORE_OPTIONS');
export const STATE_CONFIGS = new InjectionToken<StoreState[]>('STATE_CONFIGS');

export const provideStoreOptions = (options: StoreOptions) => {
    return [{ provide: STORE_OPTIONS, useValue: options }];
}

export const provideStoreStates = (configs: readonly StoreState[], options?: StoreOptions) => {
    configs.forEach(config => config.options = { ...options, ...config.options });
    return [{ provide: STATE_CONFIGS, useValue: configs, multi: true }];
}

