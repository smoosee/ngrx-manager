import { ModuleWithProviders, NgModule, inject } from '@angular/core';
import { STATE_CONFIG, STORE_OPTIONS, StateConfig, StoreOptions } from './models';
import { SignalsManager } from './services';

@NgModule({})
export class SignalsModule {
  static forRoot(options: StoreOptions, states?: Partial<StateConfig<any>>[]): ModuleWithProviders<SignalsModule> {
    return {
      ngModule: SignalsModule,
      providers: [
        { provide: STORE_OPTIONS, useValue: options },
        { provide: STATE_CONFIG, useValue: states, multi: true },
      ],
    };
  }

  static forChild(options: StoreOptions, states?: Partial<StateConfig<any>>[]): ModuleWithProviders<SignalsModule> {
    states?.forEach(state => state.options = { ...options, ...state.options });
    return {
      ngModule: SignalsModule,
      providers: [{ provide: STATE_CONFIG, useValue: states, multi: true }],
    };
  }

  constructor() {
    const manager = inject(SignalsManager);
    const options: StoreOptions = inject(STORE_OPTIONS) || {};
    const configs = (inject(STATE_CONFIG) || []) as StateConfig<any>[];
    manager.initialize(configs, options);
  }
}
