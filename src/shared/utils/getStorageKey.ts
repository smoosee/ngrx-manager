import { StoreState } from "../../models/store.state";


export function getStorageKey(state: StoreState) {
  if (state?.options?.storage) {
    const { prefix, app, storage } = state.options;
    const key = (prefix ? prefix + ' | ' : '') + (app ? app + ' | ' : '') + state.name;
    return { storage, key };
  }
  return { storage: 'none', key: '' };
}
