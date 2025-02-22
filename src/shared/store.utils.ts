import { StoreState } from "../models/store.state";

type Input = { [k: string]: any };
type Output<O extends Input, N extends Input> = O & N;

export function mergeDeep<O extends Input, N extends Input>(oPayload: O, nPayload: N, extendArrays = false): Output<O, N> {
  const oClone = structuredClone(oPayload);
  if (Array.isArray(nPayload)) {
    return extendArrays ? [].concat(...(oClone as any || []), ...nPayload) as any : [].concat(...nPayload);
  } else if (typeof nPayload === 'object') {
    return Object.entries(nPayload ?? {}).reduce((acc, [key, nValue]) => {
      acc[key] = mergeDeep(acc?.[key], nValue, extendArrays);
      return acc;
    }, (oClone || {}) as any);
  } else {
    return nPayload;
  }

}

export function isObject(value: any) {
  return !!value && typeof (value) === 'object' && !Array.isArray(value);
}

export function isEmpty(value: any) {
  const emptyString = typeof value === 'string' && value === '';
  const emptyArray = Array.isArray(value) && value.length === 0;
  const emptyObject = isObject(value) && Object.keys(value).length === 0;
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
