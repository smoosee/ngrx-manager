import { Injectable, Injector, Signal, computed, inject, runInInjectionContext } from '@angular/core';
import { ReducerManager, Store, createFeatureSelector } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { StoreAction, StoreState } from '../models';
import { ActionKeys, STATE_CONFIGS, STORE_OPTIONS, StoreOptions } from '../shared';


@Injectable()
export class StoreManager {
    states: { [key: string]: StoreState } = {};

    injector = inject(Injector);
    store = inject(Store);
    iStates: StoreState[] = [];
    iOptions: StoreOptions = {};

    constructor() {
        this.initialize();
    }

    populateInjections() {
        this.iStates = inject(STATE_CONFIGS, { optional: true }) || [];
        this.iOptions = inject(STORE_OPTIONS, { optional: true }) || {};
    }

    initialize(): void;
    initialize(states: StoreState[], options?: StoreOptions): void;
    initialize(...args: any[]) {
        runInInjectionContext(this.injector, () => {
            this.populateInjections();
            
            const states = (args?.[0] || this.iStates) as StoreState[];
            const options = (args?.[1] || this.iOptions) as StoreOptions;
            states.flat(Number.MAX_VALUE).forEach((config) => {
                this.addState(config as StoreState, options);
            });
        });
    }

    addState<T>(state: string): StoreManager;
    addState<T>(state: StoreState<T>, options?: StoreOptions): StoreManager;
    addState<T>(...args: any[]) {
        runInInjectionContext(this.injector, () => {
            this.populateInjections();

            const config = args[0];
            if (this.exists(config.name)) { return; }

            const options = { ...args[1], ... this.iOptions };
            config.options = { ...options, ...config.options };

            const state = new StoreState<T>(config, this.injector);
            this.states[state.name] = state;

            const reducerManager = this.injector.get(ReducerManager);

            reducerManager.addReducer(state.name, (data = state.initial, action) => {
                if (state.updateState) {
                    return state.updateState(data, action);
                }
                return data;
            });
        });
        return this;
    }

    mapState(data: any = {}) {
        const {
            [ActionKeys.uuid]: uuid,
            [ActionKeys.timestamp]: timestamp,
            [ActionKeys.success]: success,
            [ActionKeys.unset]: unset,
            [ActionKeys.error]: error,
            [ActionKeys.cached]: cached,
            ...rest
        } = data;
        return rest;
    }

    getData<T extends 'signal' | 'observable'>(key: string, type: 'signal'): Signal<any>;
    getData<T extends 'signal' | 'observable'>(key: string, type: 'observable'): Observable<any>;
    getData<T extends 'signal' | 'observable'>(key: string, type: T) {
        const selector = createFeatureSelector(key);
        const store = this.injector.get(Store);
        const state = {
            signal: store.selectSignal(selector),
            observable: store.select(selector)
        };
        return state[type];
    }

    signal<T>(key: string): Signal<T> {
        const signal = this.getData(key, 'signal');
        return computed(() => this.mapState(signal && signal()));
    }

    value<T>(key: string): T {
        return this.signal(key)() as T;
    }

    observable<T>(key: string, action?: StoreAction): Observable<T> {
        let observable = this.getData(key, 'observable');
        if (action) {
            return observable.pipe(
                filter((payload: any) => {
                    const noAction = !action;
                    const isSuccessful = !!payload?.[ActionKeys.success];
                    const isSameAction = payload[ActionKeys.timestamp] === action[ActionKeys.timestamp];
                    return isSuccessful && (noAction || isSameAction);
                }),
                take(1),
                map(this.mapState)
            );
        }
        return observable.pipe(map(this.mapState));
    }

    exists(key: string) {
        return !!this.states[key];
    }

    dispatch(stateKey: string, actionKey: string, payload?: any): StoreAction {
        const state = this.states[stateKey];
        if (!state) throw new Error(`dispatch::${actionKey} - State ${stateKey} does not exist`);
        const action = state.dispatch(actionKey, payload);
        return action as StoreAction;
    }
}