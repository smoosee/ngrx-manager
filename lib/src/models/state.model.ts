import { Injector, WritableSignal, computed, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable, switchMap, timeout, timer } from "rxjs";
import { ExtendedAction, StateAction } from "../models/action.model";
import { ActionStatus, DefaultActions, StoreOptions } from "../signals.const";

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
    actions: Partial<ExtendedAction>[];
    options: StoreOptions;
    reducers: StateReducer<T>[];

    readonly signal: WritableSignal<T>;
    readonly observable: Observable<T>;
    pipeline: WritableSignal<ExtendedAction[]> = signal([]);

    constructor(state?: Partial<StateConfig<T>>) {
        this.name = !state || typeof (state) === 'string' ? `${state}` : `${state.name}`;
        this.initial = state?.initial || {} as T;

        const defaultActions = Object.keys(DefaultActions).reduce((result: ExtendedAction[], name) => {
            const action = new ExtendedAction(this.name, { name });
            return [...result, action];
        }, []);

        this.actions = defaultActions.concat((state?.actions || []).map(action => new ExtendedAction(this.name, action)));
        this.options = state?.options || {};
        this.reducers = state?.reducers || [];

        const stateSignal = signal<T>(this.initial);
        const stateObservable = toObservable(stateSignal)

        this.signal = stateSignal;
        this.observable = timer(0).pipe(switchMap(() => stateObservable));

        this.update(null as any);
    }

    update(action: ExtendedAction) {
        this.signal.update(() => {
            return this.reducers.reduce((result: any, reducer: StateReducer<T>) => {
                return reducer.mapReduce(this, result, action);
            }, this.signal());
        });
    }

    reset() {
        this.signal?.update(() => this.initial as T);
    }

    subscribe(callback: (value: T) => void) {
        return this.observable.subscribe(callback);
    }

    dispatch(name: string, payload?: any) {
        const action = new ExtendedAction(this.name, this.actions.find(x => x.name === name));
        action.dispatch(payload, ActionStatus.NEW);
        this.pipeline.update(() => [...this.pipeline(), action]);
        return action;
    }

    addToPipeline(action: ExtendedAction) {
        this.pipeline.update(() => [...this.pipeline(), action]);
    }

    removeFromPipeline(action: ExtendedAction) {
        action.status.update(() => ActionStatus.NONE);
        this.pipeline.update(() => this.pipeline().filter(x => x !== action));
    }
}