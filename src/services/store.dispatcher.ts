import { Injectable } from '@angular/core';
import { StoreAction } from '../models/store.action';
import { UpdateFlag } from '../models/store.options';
import { StoreState } from '../models/store.state';
import { ActionStatus } from '../shared/store.enums';


@Injectable({ providedIn: 'root' })
export class StoreDispatcher {
  states: { [key: string]: StoreState } = {};

  add(state: StoreState) {
    this.states[state.name] = state;
  }

  exists(key: string) {
    return !!this.states[key];
  }

  dispatch(stateKey: string, actionKey: string, payload?: any, flag?: UpdateFlag) {
    const untypedAction = this.getActionByName(stateKey, actionKey);
    untypedAction.flag = untypedAction.flag || flag;

    const action = new StoreAction(untypedAction, stateKey);
    action.dispatch(payload, ActionStatus.PENDING);

    return action;
  }

  getStateByName(stateKey: string): StoreState {
    return this.states[stateKey];
  }

  getActionByName(stateKey: string, actionKey: string): StoreAction {
    const state = this.getStateByName(stateKey);
    const action = state?.actions?.find(x => x.name === actionKey) as StoreAction;
    if (action) {
      const actionFallback = this.getActionFallback(action);
      if (actionFallback) {
        return actionFallback;
      }
      return action;
    } else {
      const stateFallback = this.getStateFallback(state, actionKey);
      if (stateFallback) {
        return stateFallback;
      }
      throw new Error(`Action ${actionKey} not found in state ${stateKey}`);
    }
  }

  getActionFallback(action: StoreAction): StoreAction {
    const fallback = this.getFallbackByName(action.name, action?.fallback || []);
    return fallback ? this.getActionByName(fallback?.stateKey, fallback?.actionKey) : null as any;
  }

  getStateFallback(state: StoreState, actionKey: string): StoreAction {
    const fallback = this.getFallbackByName(actionKey, state?.fallback || []);
    return fallback ? this.getActionByName(fallback?.stateKey, fallback?.actionKey) : null as any;
  }

  getFallbackByName(searchKey: string, fallbackKeys: string[]) {
    const fallback = fallbackKeys
      .map(key => key.split('::').concat(searchKey))
      .find(([stateKey, actionKey]) => this.getActionByName(stateKey, actionKey));

    if (fallback?.length) {
      const [stateKey, actionKey] = fallback;
      return { stateKey, actionKey };
    }
    return null;
  }
}
