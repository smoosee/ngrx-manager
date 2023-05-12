import { APP_INITIALIZER } from "@angular/core";
import { SignalsManager } from "./services";
import { STATE_CONFIG, STORE_OPTIONS, StoreOptions, StateConfigs } from "./signals.const";

export const provideStoreOptions = (options: StoreOptions) => {
    return [{ provide: STORE_OPTIONS, useValue: options }];
}

const ManagerInitializer = (configs: StateConfigs) => (manager: SignalsManager) => {
    return () => new Promise(resolve => {
        manager.initialize(configs);
        resolve(true);
    });
}

export const provideStateConfigs = (configs: StateConfigs, options?: StoreOptions) => {
    configs.forEach(config => config.options = { ...options, ...config.options });
    return [
        { provide: STATE_CONFIG, useValue: configs, multi: true },
        {
            provide: APP_INITIALIZER, useFactory: ManagerInitializer(configs),
            deps: [SignalsManager],
            multi: true
        }
    ];
}