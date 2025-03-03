import { isObject } from "./isObject";


export function isEmpty(value: any) {
    const emptyString = typeof value === 'string' && value === '';
    const emptyArray = Array.isArray(value) && value.length === 0;
    const emptyObject = isObject(value) && Object.keys(value).length === 0;
    const nilValue = value === null || value === undefined;
    return nilValue || emptyString || emptyArray || emptyObject;
}
