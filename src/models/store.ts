import { inject } from "@angular/core";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { StoreEffects } from "../services/store.effects";
import { StoreFacade } from "../services/store.facade";
import { provideStoreOptions, provideStoreStates } from "../shared/store.providers";
import { Service } from "../shared/store.types";
import { StoreOptions } from "./store.options";
import { IStoreState, StoreState } from "./store.state";


export class Store<
    StateKey extends string,
    StateModel extends any,
    StateService extends Service,
    States extends readonly IStoreState<StateKey, StateModel, StateService>[]
> {

    _options!: StoreOptions;
    _states!: StoreState[];

    constructor(states: States);
    constructor(options: StoreOptions);
    constructor(options: StoreOptions, states: States);
    constructor(arg0: StoreOptions | States, arg1?: States) {
        if (arg0 instanceof Array) {
            this._states = arg0.map(state => new StoreState(state));
        } else {
            this._options = arg0 as StoreOptions;
            if (arg1 instanceof Array) {
                this._states = arg1.map(state => new StoreState(state));
            }
        }
    };

    get facade() {
        return inject<StoreFacade<States>>(StoreFacade);
    }

    provideForRoot() {
        return [
            provideStoreOptions(this._options || {}),
            provideStoreStates(this._states, this._options),
            provideStore({}),
            provideEffects(StoreEffects),
        ];
    }

    provideForChild() {
        return [
            provideStoreStates(this._states, this._options),
        ];
    }

}
