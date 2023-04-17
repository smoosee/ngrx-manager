import { effect, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { map, timer } from 'rxjs';
import { ActionStatus, ExtendedAction, StateAction } from '../models';

@Injectable({ providedIn: 'root' })
export class SignalsActions {
  currentAction = signal<ExtendedAction>(null as any);
  actions: { [key: string]: ExtendedAction } = {};

  constructor(private injector: Injector) {
    this.listen();
  }

  add(state: string, action: StateAction) {
    const key = `${state}.${action.name}`;
    const value = new ExtendedAction(state, action);
    this.actions[key] = value;
  }

  clear() {
    this.currentAction.set(null as any);
  }

  dispatch(state: string, key: string, payload?: any) {
    let action = this.actions[`${state}.${key}`];
    if (key in ActionStatus) {
      action = new ExtendedAction(state, { name: key });
    }
    action.dispatch(payload);
    this.currentAction.update(() => action);
    return action;
  }

  sideEffect(action: ExtendedAction, payload?: any, success = false) {
    const status = success ? ActionStatus.SUCCESS : ActionStatus.ERROR;
    this.currentAction.update(() => action.dispatch(payload, status));
    return action;
  }


  private listen() {
    runInInjectionContext(this.injector, () => {
      effect(
        () => {
          const action = this.currentAction();
          if (action?.status === ActionStatus.NEW) {
            try {
              let observable;
              if (action.service && action.method) {
                const service = this.injector.get<any>(action.service);
                const method = service?.[action.method];
                observable = method.apply(service, action.payload);
              } else {
                observable = timer(0).pipe(map(() => action.payload));
              }
              observable.subscribe((payload: any) => this.sideEffect(action, payload, true));
            } catch (error) {
              this.sideEffect(action, error, false);
            }
          }
        },
        { allowSignalWrites: true }
      );
    });
  }
}
