import { ActionStatus, DefaultActions, StateKeys } from '../shared/store.enums';
import { mergeDeep } from '../shared/store.utils';
import { StoreAction } from './store.action';
import { StoreState } from './store.state';

export class StoreReducer {

  getPayload(state: StoreState, payload: any, action: StoreAction) {
    return payload;
  }

  setPayload(state: StoreState, payload: any, action: StoreAction) {
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
          const { extendOnSet, extendOnDispatch, mergeDeepOnExtend } = state?.options;
          const isExtendAction = action.name === DefaultActions.EXTEND;
          const isSetAction = action.name === DefaultActions.SET;
          const isDispatchAction = !isExtendAction && !isSetAction;
          const shouldExtend = isExtendAction || (extendOnSet && isSetAction) || (extendOnDispatch && isDispatchAction);
          const merged = Object.assign(payload, action.payload);
          const mergedDeep = mergeDeep(payload, action.payload);
          const cloned = structuredClone(action.payload);
          payload = shouldExtend ? mergeDeepOnExtend ? mergedDeep : merged : cloned;
      }
    }
    Object.assign(payload, {
      [StateKeys.uuid]: action.uuid,
      [StateKeys.status]: action.status,
    });
    return payload;
  }


  mapReduce(state: any, payload: any, action: StoreAction) {
    payload = this.getPayload(state, payload, action);
    if (action.state === state.name) {
      payload = this.onAction(state, payload, action);
    }
    this.setPayload(state, payload, action);
    return payload;
  }
}



