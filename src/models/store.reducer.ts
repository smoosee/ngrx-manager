import { ActionStatus, DefaultActions, StateKeys } from '../shared/store.enums';
import { StoreAction } from './store.action';
import { StoreState } from './store.state';

export class StoreReducer {

  getPayload(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  prePopulate(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  postPopulate(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }


  onPopulate(state: StoreState, payload: any, action: StoreAction) {
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
}



