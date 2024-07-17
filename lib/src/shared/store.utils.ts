import { StoreState } from "../models/store.state";

type Input = { [k: string]: any };
type Output<O extends Input, N extends Input> = O & N;

export function mergeDeep<O extends Input, N extends Input>(oPayload: O, nPayload: N): Output<O, N> {
  const oClone = structuredClone(oPayload);
  return Object.entries(nPayload ?? {}).reduce((acc, [key, nValue]) => {
    const oValue = acc[key];
    if (Array.isArray(nValue)) {
      acc[key] = nValue.map((item, idx) => mergeDeep(oValue[idx] ?? [], item));
    } else if (typeof nValue === 'object') {
      acc[key] = mergeDeep(oValue ?? {}, nValue);
    } else {
      acc[key] = nValue;
    }
    return acc;
  }, oClone as any);

}

export function isEmpty(value: any) {
  const emptyString = typeof value === 'string' && value === '';
  const emptyArray = Array.isArray(value) && value.length === 0;
  const emptyObject = typeof value === 'object' && Object.keys(value).length === 0;
  const nilValue = value === null || value === undefined;
  return nilValue || emptyString || emptyArray || emptyObject;
}

export function uniqueBy<T extends { [k: string]: any }>(array: T[], iteratee: string | ((item: T) => string)): T[] {
  const seen = new Map();
  return array.filter((item, idx) => {
    const key: string = typeof iteratee === 'string' ? iteratee : iteratee(item);
    return seen.has(key) ? false : seen.set(key, idx) && true;
  });
}


export function getStorageKey(state: StoreState) {
  if (state?.options?.storage) {
    const { prefix, app, storage } = state.options;
    const key = (prefix ? prefix + ' | ' : '') + (app ? app + ' | ' : '') + state.name;
    return { storage, key };
  }
  return { storage: 'none', key: '' };
}
