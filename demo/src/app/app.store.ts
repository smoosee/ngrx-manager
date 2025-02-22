import { Store, StoreAction, StoreState } from "@smoosee/ngrx-manager";
import { AppState, SharedState } from "./app.models";
import { AppService } from "./app.service";


export const AppStore = new Store(
  {
    app: 'app',
    prefix: '',
    storage: 'local',
    flags: {
      onSet: 'replace',
      onDispatch: 'extend',
    }
  }, [
  new StoreState({
    name: 'App',
    initial: <AppState>{},
    service: AppService,
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
]);