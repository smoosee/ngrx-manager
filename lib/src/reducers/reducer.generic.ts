import { ActionKeys, ActionStatus, DefaultActions } from '../shared';
import { StoreAction, StoreState } from '../models';

export class GenericReducer {
  constructor() { }

  static mapReduce(config: StoreState, value: any, action?: StoreAction) {
    let success, timestamp, unset, error;
    if (action?.state === config.name) {
      const status = action.status;
      if (status === ActionStatus.SUCCESS) {
        success = true;
        timestamp = action[ActionKeys.timestamp];
        if (action.name === DefaultActions.UNSET) {
          value = {};
          unset = true;
        } else {
          Object.assign(value, action.payload);
        }
      } else {
        error = true;
      }

      Object.assign(value, {
        [ActionKeys.uuid]: action[ActionKeys.uuid],
        [ActionKeys.success]: success,
        [ActionKeys.unset]: unset,
        [ActionKeys.error]: error,
        [ActionKeys.timestamp]: timestamp,
      });
    }
    return value;
  }
}
