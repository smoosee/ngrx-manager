import { cloneDeep, isArray, mergeWith } from 'lodash-es';

export { uniqBy } from 'lodash-es';

export function mergeDeep<T>(oldPayload: T, newPayload: T): T {
    if (isArray(oldPayload) || isArray(newPayload)) {
        return [].concat((oldPayload || []) as any, (newPayload || []) as any) as T;
    }
    return mergeWith(cloneDeep(oldPayload), newPayload, (oldValue, newValue) => {
        if (isArray(oldValue) || isArray(newValue)) {
            return [].concat((oldValue || []) as any, (newValue || []) as any);
        }
        return;
    });
}