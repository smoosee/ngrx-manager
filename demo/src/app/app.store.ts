import { Store } from "@smoosee/ngrx-manager";
import { AppState, SharedState } from "./app.models";
import { AppService } from "./app.service";


export const AppStore = new Store([
  {
    name: 'App',
    initial: <AppState>{},
    service: AppService,
  },
  {
    name: 'Shared',
    initial: <SharedState>{},
    actions: [
      {
        name: 'SHARED_DISPATCH',
        service: AppService,
        method: 'sharedDispatch',
      }
    ] as const
  }
]);