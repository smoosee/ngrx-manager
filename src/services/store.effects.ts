import { Injectable, Injector, effect, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Actions, createEffect } from '@ngrx/effects';
import { Observable, catchError, filter, from, map, mergeMap, of } from 'rxjs';
import { StoreAction } from '../models/store.action';
import { ActionStatus } from '../shared/store.enums';
import { isObject } from '../shared/store.utils';


@Injectable({ providedIn: 'root' })
export class StoreEffects {
  effect$!: Observable<StoreAction>;

  pipeline = signal<StoreAction[]>([]);
  pipelineObservable = toObservable(this.pipeline);

  processor = effect(
    () => {
      const pipeline = this.pipeline();
      this.executeAction(this.pipelineObservable as any).subscribe(console.log);
    },
    { allowSignalWrites: true }
  );

  constructor(private actions$: Actions<StoreAction>, private injector: Injector) {
    this.createEffect();
    // effect(
    //   () => {
    //     const pipeline = state.pipeline();
    //     pipeline.forEach(action => {
    //       const status = action.status();
    //       if (status === ActionStatus.NEW) {
    //         action.execute(this.injector);
    //       } else if (status === ActionStatus.SUCCESS) {
    //         state.update(action);
    //         state.removeFromPipeline(action);
    //       }
    //     });
    //   },
    //   { allowSignalWrites: true }
    // );
  }

  createEffect() {
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
