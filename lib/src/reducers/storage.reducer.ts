import { isEmpty } from 'lodash-es';
import { ExtendedAction, StateConfig } from '../models';
import { ActionKeys, ActionStatus } from '../signals.const';
import { GenericReducer } from './generic.reducer';

declare const window: any;

export class StorageReducer extends GenericReducer {
  constructor() {
    super();
  }

  static override mapReduce(config: StateConfig<any>, value: any, action?: ExtendedAction) {
    let newValue = this.getValue(config, value);
    if (action) {
      newValue = value;
      if (action.status() === ActionStatus.SUCCESS) {
        Object.assign(newValue, action.payload);
      }
    }
    this.setValue(config, newValue);
    return newValue;
  }

  static getValue(config: any, payload: any) {
    const { storage, key } = this.getKey(config);
    if (key && storage !== 'none') {
      const value = window[storage + 'Storage'].getItem(key);
      return value === 'undefined'
        ? {}
        : JSON.parse(value || '{}') || payload || {};
    }
    return payload || {};
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
      const key =
        (prefix ? prefix + ' | ' : '') + (app ? app + ' | ' : '') + config.name;
      return { storage, key };
    }
    return { storage: 'none', key: '' };
  }
}
