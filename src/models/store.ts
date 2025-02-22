import { inject } from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { StoreEffects } from "../services/store.effects";
import { StoreFacade } from "../services/store.facade";
import { provideStoreOptions, provideStoreStates } from "../shared/store.providers";
import { StoreOptions } from "./store.options";
import { StoreState } from "./store.state";

export class Store<Key extends string, States extends StoreState<Key>[]> {

    constructor(public options: StoreOptions, public states: States) { };

    get facade() {
        return inject<StoreFacade<States>>(StoreFacade);
    }

    provideForRoot() {
        return [
            provideStoreOptions(this.options || {}),
            provideStoreStates(this.states, this.options),
            provideStore({}),
            provideEffects(StoreEffects),
        ];
    }

    provideForChild() {
        return [
            provideStoreStates(this.states, this.options),
        ];
    }

}
