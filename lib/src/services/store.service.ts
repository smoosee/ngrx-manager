import {
  Injectable,
  Injector,
  Signal,
  computed,
  effect,
  runInInjectionContext
} from '@angular/core';
import { Observable, filter, map, take } from 'rxjs';
import { ActionKeys, ActionStatus, ExtendedAction, StateConfig } from '../models';
import { SignalsActions } from './actions.service';

@Injectable({ providedIn: 'root' })
export class SignalsStore {
  states: { [key: string]: StateConfig<any> } = {};

  constructor(private injector: Injector, private actions: SignalsActions) {
    this.listen();
  }

  private map = (state: any) => {
    const {
      [ActionKeys.timestamp]: timestamp,
      [ActionKeys.success]: success,
      [ActionKeys.unset]: unset,
      [ActionKeys.error]: error,
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
          (payload: any) =>
            !!payload?.[ActionKeys.success] &&
            (!action ||
              payload[ActionKeys.timestamp] === action[ActionKeys.timestamp])
        ),
        take(1)
      );
    }
    return observable.pipe(map(this.map));
  }

  exists(key: string) {
    return !!this.states[key];
  }

  add<T>(state: StateConfig<T>) {
    runInInjectionContext(this.injector, () => {
      if (this.exists(state.name)) {
        return;
      }
      this.states[state.name] = new StateConfig<T>(state);
    });
  }

  private listen() {
    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const action = this.actions.currentAction();
          if (action?.status === ActionStatus.SUCCESS) {
            this.states[action.state].update(action);
            this.actions.clear();
          }
        },
        { allowSignalWrites: true }
      );
    });
  }
}
