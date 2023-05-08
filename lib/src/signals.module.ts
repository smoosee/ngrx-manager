import { ModuleWithProviders, NgModule, inject } from '@angular/core';
import { STATE_CONFIG, STORE_OPTIONS, StateConfig, StoreOptions } from './models';
import { SignalsManager } from './services';

@NgModule({})
export class SignalsModule {
  static forRoot(options?: StoreOptions, states?: Partial<StateConfig<any>>[]): ModuleWithProviders<SignalsModule> {
    return {
      ngModule: SignalsModule,
      providers: [
        { provide: STORE_OPTIONS, useValue: options },
        { provide: STATE_CONFIG, useValue: states, multi: true },
      ],
    };
  }

  static forChild(options?: StoreOptions, states?: Partial<StateConfig<any>>[]): ModuleWithProviders<SignalsModule> {
    states?.forEach(state => state.options = { ...options, ...state.options });
    return {
      ngModule: SignalsModule,
      providers: [{ provide: STATE_CONFIG, useValue: states, multi: true }],
    };
  }

  constructor() {
    const manager = inject(SignalsManager);
    const options: StoreOptions = inject<StoreOptions>(STORE_OPTIONS, { optional: true }) || {} as any;
    const configs: StateConfig<any>[] = inject(STATE_CONFIG, { optional: true }) || [] as any;
    manager.initialize(configs, options);
  }
}
