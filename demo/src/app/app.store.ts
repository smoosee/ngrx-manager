import { StateConfig, StoreOptions } from "@smoosee/ngrx-manager";
import { AppService } from "./app.service";

export const AppStoreOptions: StoreOptions = {
    app: 'app',
    prefix: '',
    storage: 'local'
};

export const AppStoreStates: Partial<StateConfig<any>>[] = [
    {
        name: 'App',
        actions: [
            {
                name: 'TEST_FN',
                service: AppService,
                method: 'testFn2',
            }
        ]
    },
];