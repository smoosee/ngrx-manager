import { ModuleWithProviders, NgModule } from '@angular/core';
import { StateConfigs, StoreOptions } from './models';
import { provideStateConfigs, provideStoreOptions } from './signals.providers';

@NgModule({})
export class SignalsModule {
  static forRoot(options?: StoreOptions, states?: StateConfigs): ModuleWithProviders<SignalsModule> {
    return {
      ngModule: SignalsModule,
      providers: [
        ...provideStoreOptions(options || {}),
        ...provideStateConfigs(states || []),
      ],
    };
  }

  static forChild(options?: StoreOptions, states?: StateConfigs): ModuleWithProviders<SignalsModule> {
    states?.forEach(state => state.options = { ...options, ...state.options });
    return {
      ngModule: SignalsModule,
      providers: [...provideStateConfigs(states || []),],
    };
  }
}
