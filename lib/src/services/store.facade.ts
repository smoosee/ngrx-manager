import { inject, Injectable, Signal } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { Observable, lastValueFrom, of, exhaustMap } from 'rxjs';
import { DefaultActions, mergeDeep } from '../shared';
import { StoreManager } from './store.manager';


type StateKey<States extends readonly any[]> = States[number]['name'];
type StateData<States extends readonly any[], T extends StateKey<States>> = Extract<States[number], { name: T }>['initial'];
type StateActions<States extends readonly any[], T extends StateKey<States>> = Extract<States[number], { name: T }>['actions'][number]['name'];

@Injectable()
export class StoreFacade<S extends readonly any[] = any, K extends string = StateKey<S>> {
    cache: any = {};

    manager = inject(StoreManager);

    constructor() { }

    selectAsync<T extends K>(stateKey: T): Observable<StateData<S, T>> {
        return this.select(stateKey, true);
    }

    select<T extends K>(stateKey: T): StateData<S, T>;
    select<T extends K>(stateKey: T, async: false): Signal<StateData<S, T>>;
    select<T extends K>(stateKey: T, async: true): Observable<StateData<S, T>>;
    select<T extends K>(stateKey: T, async: boolean | null = null) {
        if (async === null) {
            return this.manager.value(stateKey);
        } else if (async) {
            return this.manager.observable(stateKey);
        } else {
            return this.manager.signal<T>(stateKey);
        }
    }

    dispatch<T extends K, A extends StateActions<S, T>>(stateKey: T, actionKey: A, payload?: string | Partial<StateData<S, T>>): Observable<StateData<S, T>> {
        const action = this.manager.dispatch(stateKey, actionKey, payload);
        return this.manager.observable(stateKey, action);
    }

    get<T extends K>(stateKey: T): Observable<StateData<S, T>> {
        return this.dispatch(stateKey, DefaultActions.GET);
    }

    set<T extends K>(stateKey: T, payload: Partial<StateData<S, T>>) {
        return this.dispatch(stateKey, DefaultActions.SET, payload);
    }

    unset<T extends K>(stateKey: T) {
        return lastValueFrom(this.dispatch(stateKey, DefaultActions.UNSET));
    }

    extend<T extends K>(stateKey: T, payload: Partial<StateData<S, T>>): Promise<StateData<S, T>>;
    extend<T extends K>(stateKey: T, getter: Observable<any>, key: string): Promise<StateData<S, T>>;
    extend<T extends K>(stateKey: T, getter: Observable<any>, key: string, formatter: (payload: any) => StateData<S, T>): Promise<StateData<S, T>>;

    extend<T extends K>(stateKey: T, ...args: any[]) {
        return lastValueFrom(this.extendAsync(stateKey, ...args));
    }

    extendAsync<T extends K>(stateKey: T, ...args: any[]) {
        const payload = args[0];
        const getter = payload instanceof Observable ? payload : of(payload);
        const key = args[1];
        const formatter = args[2] || ((payload: StateData<S, T>) => payload);

        return getter.pipe(exhaustMap((payload: Partial<StateData<S, T>>) => {
            let stateData = this.select(stateKey);
            if (key) {
                stateData[key] = mergeDeep(stateData[key], payload);
            } else {
                stateData = mergeDeep(stateData, payload);
            }
            return this.dispatch(stateKey, DefaultActions.EXTEND, formatter(stateData));
        }));
    }

    init<T extends K>(stateKey: T, getter: Observable<StateData<S, T>>, formatter: (payload: any) => StateData<S, T>, force = false): Promise<StateData<S, T>> {
        return lastValueFrom(this.initAsync(stateKey, getter, formatter, force));
    }
    initAsync<T extends K>(stateKey: T, getter: Observable<StateData<S, T>>, formatter: (payload: any) => StateData<S, T>, force = false): Observable<StateData<S, T>> {
        formatter = formatter || ((payload: StateData<S, T>) => payload);
        const stateData = this.select(stateKey);
        if (!isEmpty(stateData) && !force) {
            getter = of(stateData);
        }

        return getter.pipe(exhaustMap((payload: Partial<StateData<S, T>>) => {
            return this.set(stateKey, formatter(payload));
        }));
    }

    clear<T extends K>(exclude: T[] = []) {
        Object.keys(this.manager.states).forEach((stateKey) => {
            if (exclude.includes(stateKey as T)) {
                this.cache[stateKey as T] = this.select(stateKey as K);
            } else {
                this.unset(stateKey as T);
            }
        });
    }

    restore() {
        Object.keys(this.cache).forEach((stateKey) => {
            this.set(stateKey as K, this.cache[stateKey]);
            delete this.cache[stateKey];
        });
    }
}