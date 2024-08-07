import { ActionStatus, DefaultActions, StateKeys } from '../shared/store.enums';
import { StoreAction } from './store.action';
import { StoreState } from './store.state';

export class StoreReducer {

  preAction(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  postAction(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  getPayload(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  onAction(state: StoreState, payload: any, action: StoreAction) {
    if (action.status === ActionStatus.SUCCESS) {
      switch (action.name) {
        case DefaultActions.UNSET:
          payload = {};
          break;
        default:
          if (!action.payload) { break; }
          payload = this.getPayload(state, payload, action);
      }
    }
    Object.assign(payload, {
      [StateKeys.uuid]: action.uuid,
      [StateKeys.status]: action.status,
    });
    return payload;
  }


  mapReduce(state: any, payload: any, action: StoreAction) {
    payload = this.preAction(state, payload, action);
    if (action.state === state.name) {
      payload = this.onAction(state, payload, action);
    }
    this.postAction(state, payload, action);
    return payload;
  }
}



