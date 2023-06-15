import { Injectable, Injector } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Observable, catchError, mergeMap, filter, map, of, from } from 'rxjs';
import { ActionStatus } from '../shared';
import { StoreAction } from '../models/store.action';


@Injectable({ providedIn: 'root' })
export class StoreEffects {
    effect$: Observable<StoreAction> | undefined;

    constructor(private actions$: Actions<StoreAction>, private injector: Injector) {
        this.createEffect();
    }

    createEffect() {
        this.effect$ = createEffect(() => this.executeAction(this.actions$));
    }

    executeAction(action: Observable<StoreAction>) {
        return from(action).pipe(
            filter((action) => action.status && action.status() === ActionStatus.NEW),
            mergeMap((action) => {
                let returnObservable = of(action.payload);
                if (action.service && action.method) {
                    returnObservable = this.injector.get<any>(action.service)[action.method](action.payload);
                }

                return returnObservable.pipe(
                    map((payload) => new StoreAction(action, action.state).dispatch(payload, ActionStatus.SUCCESS)),
                    catchError((error) => of(new StoreAction(action, action.state).dispatch(error, ActionStatus.ERROR))),
                );
            })
        );
    }

}