import { ExtendedAction, StateConfig } from '../models';
import { ActionKeys, ActionStatus, DefaultActions } from '../signals.const';

export class GenericReducer {
  constructor() { }

  static mapReduce(
    config: StateConfig<any>,
    value: any,
    action?: ExtendedAction
  ) {
    let success, timestamp, unset, error;
    if (action) {
      if (action.status() === ActionStatus.SUCCESS) {
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
        [ActionKeys.success]: success,
        [ActionKeys.unset]: unset,
        [ActionKeys.error]: error,
        [ActionKeys.timestamp]: timestamp,
      });
    }
    return value;
  }
}
