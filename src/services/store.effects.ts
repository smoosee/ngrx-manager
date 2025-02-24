import { Injectable, Injector, inject } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Observable, catchError, filter, from, map, mergeMap, of } from 'rxjs';
import { StoreAction } from '../models/store.action';
import { ActionStatus } from '../shared/store.enums';
import { isObject } from '../shared/store.utils';


@Injectable({ providedIn: 'root' })
export class StoreEffects {
  private actions$ = inject(Actions);
  private injector = inject(Injector);

  effect$!: Observable<StoreAction>;

  constructor() {
    this.effect$ = createEffect(() => this.executeAction(this.actions$));
  }

  executeAction(action: Observable<StoreAction>) {
    return from(action).pipe(
      filter((action) => action.status === ActionStatus.PENDING),
      mergeMap((action) => {
        let payload, returnObservable;

        if (action.service && action.method) {
          payload = this.injector.get<any>(action.service)[action.method](action.payload);
          if (payload instanceof Observable) {
            returnObservable = payload;
          }
        }

        payload = payload ?? action.payload;
        returnObservable = returnObservable ?? of(isObject(payload) ? payload : { payload });

        return returnObservable.pipe(
          map((payload) => new StoreAction({ ...action, payload, status: ActionStatus.SUCCESS }, action.state)),
          catchError((payload) => of(new StoreAction({ ...action, payload, status: ActionStatus.ERROR }, action.state))),
        );
      })
    );
  }

}
