import { isEmpty } from 'lodash-es';
import { ActionKeys, ActionStatus, DefaultActions } from '../shared';
import { GenericReducer } from './reducer.generic';
import { StoreAction, StoreState } from '../models';

declare const window: any;

export class StorageReducer extends GenericReducer {
  constructor() {
    super();
  }

  static override mapReduce(config: StoreState, value: any, action?: StoreAction) {
    let newValue = this.getValue(config, value);
    if (action?.state === config.name) {
      const status = typeof (action.status) === 'function' ? action.status() : action.status;
      if (status === ActionStatus.SUCCESS) {
        if (action.name === DefaultActions.UNSET) {
          newValue = {};
        } else {
          Object.assign(newValue, action.payload);
        }
      }
    }
    this.setValue(config, newValue);
    return newValue;
  }

  static getValue(config: any, payload: any) {
    const { storage, key } = this.getKey(config);
    if (key && storage !== 'none') {
      const value = window[storage + 'Storage'].getItem(key);
      const parsedValue = value === 'undefined' ? {} : JSON.parse(value || '{}');
      return { ...parsedValue, ...payload };
    }
    return { ...payload };
  }

  static setValue(config: any, payload: any) {
    const { storage, key } = this.getKey(config);
    if (key && storage !== 'none') {
      const {
        [ActionKeys.timestamp]: timestamp,
        [ActionKeys.success]: success,
        [ActionKeys.unset]: unset,
        [ActionKeys.error]: error,
        [ActionKeys.cached]: cached,
        ...rest
      } = payload;

      let value;
      if (!isEmpty(rest)) {
        value = JSON.stringify(payload);
      }

      window[storage + 'Storage'].setItem(key, value || '');
    }
  }

  static getKey(config: any) {
    if (config?.options?.storage) {
      const { prefix, app, storage } = config.options;
      const key = (prefix ? prefix + ' | ' : '') + (app ? app + ' | ' : '') + config.name;
      return { storage, key };
    }
    return { storage: 'none', key: '' };
  }
}
