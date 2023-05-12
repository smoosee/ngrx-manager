import {
  Injectable,
  Injector,
  Signal,
  computed,
  effect,
  runInInjectionContext
} from '@angular/core';
import { Observable, filter, map, take } from 'rxjs';
import { ExtendedAction, StateConfig } from '../models';
import { ActionKeys, ActionStatus } from '../signals.const';

@Injectable({ providedIn: 'root' })
export class SignalsStore {
  states: { [key: string]: StateConfig<any> } = {};

  constructor(private injector: Injector) { }

  private map = (state: any) => {
    const {
      [ActionKeys.timestamp]: timestamp,
      [ActionKeys.success]: success,
      [ActionKeys.unset]: unset,
      [ActionKeys.error]: error,
      [ActionKeys.cached]: cached,
      ...rest
    } = state;
    return rest;
  };

  signal<T>(key: string): Signal<T> {
    return computed(() => this.map(this.states[key].signal()));
  }

  value<T>(key: string): T {
    return this.signal<T>(key)();
  }

  observable<T>(key: string, action?: ExtendedAction): Observable<T> {
    let observable = this.states[key].observable;
    if (action) {
      observable = observable.pipe(
        filter(
          (payload: any) => {
            const isSuccessful = !!payload?.[ActionKeys.success];
            const isSameAction = payload[ActionKeys.timestamp] === action[ActionKeys.timestamp];
            const noAction = !action;
            return isSuccessful && (noAction || isSameAction);
          }),
        take(1)
      );
    }
    return observable.pipe(map(this.map));
  }

  exists(key: string) {
    return !!this.states[key];
  }

  add<T>(config: StateConfig<T>) {
    runInInjectionContext(this.injector, () => {
      if (this.exists(config.name)) { return; }

      const state = new StateConfig<T>(config);
      this.states[config.name] = state;

      effect(
        () => {
          const pipeline = state.pipeline();
          pipeline.forEach(action => {
            const status = action.status();
            if (status === ActionStatus.NEW) {
              action.execute(this.injector);
            } else if (status === ActionStatus.SUCCESS) {
              state.update(action);
              state.removeFromPipeline(action);
            }
          });
        },
        { allowSignalWrites: true }
      );
    });
  }

  dispatch(stateKey: string, actionKey: string, payload?: any) {
    const state = this.states[stateKey];
    const action = state.dispatch(actionKey, payload);
    return action;
  }
}
