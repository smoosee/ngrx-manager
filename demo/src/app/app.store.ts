import { StoreAction, StoreOptions, StoreState } from "@smoosee/ngrx-manager";
import { AppService } from "./app.service";

export const AppStoreOptions: StoreOptions = {
  app: 'app',
  prefix: '',
  storage: 'local',
  flags: {
    extendOnSet: false,
    extendOnDispatch: true,
  }
};

interface AppState {
  set: boolean;
  extend: boolean;
  nestedValue: {
    name: string;
    age: number;
    address: {
      address: string;
      city: string;
    }
    arr: (string | number)[]
  }
}
interface SharedState {
  useThis: boolean;
  useThat: boolean;
}

export const AppStoreStates = [
  new StoreState({
    name: 'App',
    fallback: ['Shared'],
    initial: <AppState>{},
    actions: [
      new StoreAction({
        name: 'APP_LOG',
        service: AppService,
        method: 'appLog',
      }),
      new StoreAction({
        service: AppService,
        name: 'APP_DISPATCH',
        method: 'appDispatch',
      }),
      new StoreAction({
        name: 'APP_DEPRECATED',
        deprecated: true,
        fallback: ['Shared::SHARED_DISPATCH'],
      })
    ]
  }),
  new StoreState({
    name: 'Shared',
    initial: <SharedState>{},
    actions: [
      new StoreAction({
        name: 'SHARED_DISPATCH',
        service: AppService,
        method: 'sharedDispatch',
      })
    ]
  })
];
