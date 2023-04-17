import { WritableSignal, signal } from "@angular/core";
import { fromSignal } from "@angular/core/rxjs-interop";
import { Observable, switchMap, timeout, timer } from "rxjs";
import { ExtendedAction, StateAction } from "../models/action.model";
import { ActionStatus, StoreOptions } from "./signals.const";

export interface StateReducer<T> {
    mapReduce: (
        state: StateConfig<T>,
        value: any,
        action?: ExtendedAction
    ) => any;
}

export class StateConfig<T> {
    name: string;
    initial: T;
    actions: StateAction[];
    options: StoreOptions;
    reducers: StateReducer<T>[];

    readonly signal: WritableSignal<T>;
    readonly observable: Observable<T>;

    constructor(state?: Partial<StateConfig<T>>) {
        this.name = !state || typeof (state) === 'string' ? `${state}` : `${state.name}`;
        this.initial = state?.initial || {} as T;
        this.actions = state?.actions || [];
        this.options = state?.options || {};
        this.reducers = state?.reducers || [];

        const stateSignal = signal<T>(this.initial);
        const stateObservable = fromSignal(stateSignal)
        this.signal = stateSignal;
        this.observable = timer(0).pipe(switchMap(() => stateObservable));

        this.update();
    }

    update(action?: ExtendedAction) {
        this.signal?.update(() => {
            const setData = !this.options.extendByDefault || action?.name === ActionStatus.SET;
            const extendData = !!this.options.extendByDefault || action?.name === ActionStatus.EXTEND;
            const value = setData && !extendData ? {} : this.signal();
            return this.reducers.reduce((result: any, reducer: StateReducer<T>) => {
                return reducer.mapReduce(this, result, action);
            }, value);
        });
    }

    reset() {
        this.signal?.update(() => this.initial as T);
    }

    subscribe(callback: (value: T) => void) {
        return this.observable.subscribe(callback);
    }
}