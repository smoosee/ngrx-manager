import {
  ActionKeys,
  ActionStatus,
  ExtendedAction,
  StateConfig,
} from '../models';

export class GenericReducer {
  constructor() { }

  static mapReduce(
    config: StateConfig<any>,
    value: any,
    action?: ExtendedAction
  ) {
    let success, timestamp, unset, error;
    if (action) {
      if (action.type.includes(ActionStatus.SUCCESS)) {
        success = true;
        timestamp = action[ActionKeys.timestamp];
        Object.assign(value, action.payload);
      } else if (action.type.includes(ActionStatus.UNSET)) {
        unset = true;
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
