import { ModuleWithProviders, NgModule, inject } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { StoreEffects, StoreFacade, StoreManager } from './services';
import { STATE_CONFIGS, STORE_OPTIONS, StoreOptions, provideStoreOptions, provideStoreStates } from './shared';

@NgModule({})
export class StoreModule {
    static forRoot(options: StoreOptions = {}, states: readonly any[] = []): ModuleWithProviders<StoreModule> {
        return {
            ngModule: StoreModule,
            providers: [
                provideStoreOptions(options),
                provideStoreStates(states, options),
                provideStore({}),
                provideEffects(StoreEffects),
                StoreFacade,
                StoreManager,
            ],
        };
    }

    static forChild(states: readonly any[] = [], options: StoreOptions = {}): ModuleWithProviders<StoreModule> {
        return {
            ngModule: StoreModule,
            providers: [...provideStoreStates(states, options)],
        };
    }

    constructor() {
        const manager = inject(StoreManager);
        const states = inject(STATE_CONFIGS);
        const options = inject(STORE_OPTIONS);
        manager.initialize(states, options);
    }
}
