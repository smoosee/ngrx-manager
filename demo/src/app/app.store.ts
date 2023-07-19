import { StoreAction, StoreState, StoreOptions } from "@smoosee/ngrx-manager";
import { AppService } from "./app.service";

export const AppStoreOptions: StoreOptions = {
    app: 'app',
    prefix: '',
    storage: 'local',
};

interface AppState {
    set: boolean;
    extend: boolean;
}
interface SharedState {
    useThis: boolean;
    useThat: boolean;
}

export const AppStoreStates = [
    new StoreState({
        name: 'App',
        initial: <AppState>{},
        actions: [
            new StoreAction({
                name: 'APP_TEST_1',
                service: AppService,
                method: 'testFn',
            }),
            new StoreAction({
                service: AppService,
                name: 'APP_TEST_2',
                method: 'testFn2',
            })
        ]
    }),
    new StoreState({
        name: 'Shared',
        initial: <SharedState>{},
        actions: [
            new StoreAction({
                name: 'Shared_TEST_1',
                service: AppService,
                method: 'testFn2',
            })
        ]
    })
];