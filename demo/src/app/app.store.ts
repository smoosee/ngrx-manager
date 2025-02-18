import { StoreAction, StoreOptions, StoreState } from "@smoosee/ngrx-manager";
import { AppService } from "./app.service";

export const AppStoreOptions: StoreOptions = {
  app: 'app',
  prefix: '',
  storage: 'local',
  flags: {
    onSet: 'replace',
    onDispatch: 'extend',
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
    service: AppService,
    actions: [
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
