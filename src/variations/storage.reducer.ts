import { StoreReducer } from "../models/store.reducer";
import { StoreState } from "../models/store.state";
import { StateKeys } from "../shared/store.enums";
import { getStorageKey, isEmpty } from "../shared/store.utils";

declare const window: any;

export class StorageReducer extends StoreReducer {
  override prePopulate(config: any, payload: any) {
    const { storage, key } = getStorageKey(config);
    if (key && storage !== 'none') {
      const value = window[storage + 'Storage'].getItem(key);
      const parsedValue = value === 'undefined' ? {} : JSON.parse(value || '{}');
      return { ...parsedValue, ...payload };
    }
    return { ...payload };
  }

  override postPopulate(state: StoreState, payload: any) {
    const { storage, key } = getStorageKey(state);
    if (key && storage !== 'none') {
      const {
        [StateKeys.uuid]: uuid,
        [StateKeys.status]: status,
        ...rest
      } = payload;

      let value;
      if (!isEmpty(rest)) {
        value = JSON.stringify(payload);
      }

      window[storage + 'Storage'].setItem(key, value || '{}');
    }
    return payload;
  }

}
