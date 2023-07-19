import { Injector } from "@angular/core";
import { Store } from "@ngrx/store";
import { GenericReducer, StorageReducer } from "../reducers";
import { ActionStatus, DefaultActions, StoreOptions } from "../shared";
import { StoreAction } from "./store.action";

export interface StateReducer<T, A extends any[] = any, K extends string = string> {
    mapReduce: (
        state: StoreState<T, A, K>,
        value: any,
        action?: StoreAction
    ) => any;
}

export class StoreState<T = any, A extends any[] = any[], K extends string = string> {
    name: K;
    initial: T;
    actions: A;
    options?: StoreOptions;
    reducers?: StateReducer<T, A, K>[];

    constructor(state?: Partial<StoreState<T, A, K>>, private injector?: Injector) {
        this.name = !state || typeof (state) === 'string' ? state as any : state.name;
        this.initial = state?.initial || {} as T;

        const defaultActions = Object.keys(DefaultActions);
        this.actions = [...state?.actions || [], ...defaultActions].map(untypedAction => new StoreAction(untypedAction, this.name)) as A;

        this.options = state?.options || {};
        this.reducers = [GenericReducer as any, ...(state?.reducers || [])];
        if (['session', 'local'].includes(this.options.storage as string)) {
            this.reducers?.push(StorageReducer as any);
        }
    }

    updateState?(state: any, action: StoreAction): T {
        return this.reducers?.reduce((result, reducer) => {
            return reducer.mapReduce(this, result, action as StoreAction);
        }, { ...state });
    }

    dispatch(name: string, payload?: any) {
        const untypedAction = this?.actions?.find(x => x.name === name) as StoreAction;
        const action = new StoreAction(untypedAction, this.name);
        action.dispatch(payload, ActionStatus.NEW);
        if (this.injector) {
            const store = this.injector.get(Store);
            store.dispatch(action);
        }
        return action;
    }
}