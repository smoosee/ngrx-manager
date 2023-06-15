import { Injectable } from '@angular/core';
import { SignalsFacade, SignalsManager } from '@smoosee/ngrx-manager';
import { AppStoreOptions, AppStoreStates } from './app.store';

interface AppState {
    set: boolean;
    extend: boolean;
}
interface SharedState {
    useThis: boolean;
    useThat: boolean;
}

type StateKey = "App" | "Shared";
type StateData = {
    [T in StateKey]: T extends "App" ? AppState :
    T extends "Shared" ? SharedState :
    never;
}

@Injectable({ providedIn: 'root' })
export class StoreFacade extends SignalsFacade<StateKey, StateData> {
    constructor() {
        super();

        this.manager.initialize(AppStoreStates, AppStoreOptions);
    }
}