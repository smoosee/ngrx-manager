import { StoreOptions } from '../models/store.options';
import { StoreState } from '../models/store.state';
import { getStorageKey, isEmpty, isObject, mergeDeep, uniqueBy } from './store.utils';


describe('store.utils', () => {

    beforeAll(() => {
        global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val ?? {}));
    });

    describe('mergeDeep', () => {
        it('should merge two objects deeply', () => {
            const obj1 = { a: 1, b: { c: 2, d: 3 } };
            const obj2 = { b: { c: 4, e: 5 }, f: 6 };
            expect(mergeDeep(obj1, obj2)).toMatchSnapshot();
        });

        it('should override values in the first object with values from the second object', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            expect(mergeDeep(obj1, obj2)).toMatchSnapshot();
        });

        it('should handle null and undefined values gracefully', () => {
            const obj1 = { a: 1, b: null };
            const obj2 = { b: { c: 2 }, d: undefined };
            expect(mergeDeep(obj1, obj2)).toMatchSnapshot();
        });

        it('should merge arrays by replacing the first array if extendArrays is false', () => {
            const obj1 = { a: [1, 2] };
            const obj2 = { a: [3, 4] };
            expect(mergeDeep(obj1, obj2)).toMatchSnapshot();
        });

        it('should merge arrays by extending the first array if extendArrays is true', () => {
            const obj1 = { a: [1, 2] };
            const obj2 = { a: [3, 4] };
            expect(mergeDeep(obj1, obj2, true)).toMatchSnapshot();
        });

        it('should handle merging when the first argument is undefined', () => {
            const obj2 = { a: 1, b: 2 };
            expect(mergeDeep(undefined as any, obj2)).toMatchSnapshot();
        });

        it('should handle merging when the second argument is undefined', () => {
            const obj1 = { a: 1, b: 2 };
            expect(mergeDeep(obj1, undefined as any)).toMatchSnapshot();
        });

        it('should handle merging with nested null and undefined values', () => {
            const obj1 = { a: { b: 1, c: null } };
            const obj2 = { a: { c: 2, d: undefined } };
            expect(mergeDeep(obj1, obj2)).toMatchSnapshot();
        });

        it('should not modify the original objects', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { b: { d: 3 }, e: 4 };
            mergeDeep(obj1, obj2);
            expect(obj1).toEqual({ a: 1, b: { c: 2 } });
            expect(obj2).toEqual({ b: { d: 3 }, e: 4 });
        });
    });

    describe('isObject', () => {
        it('should return true for objects', () => {
            expect(isObject({})).toBe(true);
            expect(isObject({ a: 1 })).toBe(true);
        });

        it('should return false for non-objects', () => {
            expect(isObject(null)).toBe(false);
            expect(isObject(undefined)).toBe(false);
            expect(isObject('string')).toBe(false);
            expect(isObject(123)).toBe(false);
            expect(isObject([])).toBe(false);
        });
    });

    describe('isEmpty', () => {
        it('should return true for null or undefined', () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(isEmpty('')).toBe(true);
        });

        it('should return true for empty array', () => {
            expect(isEmpty([])).toBe(true);
        });

        it('should return true for empty object', () => {
            expect(isEmpty({})).toBe(true);
        });

        it('should return false for non-empty values', () => {
            expect(isEmpty('test')).toBe(false);
            expect(isEmpty([1, 2])).toBe(false);
            expect(isEmpty({ a: 1 })).toBe(false);
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(false)).toBe(false);
        });
    });

    describe('uniqueBy', () => {
        it('should return an array with unique objects based on a property', () => {
            const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
            expect(uniqueBy(arr, 'id')).toMatchSnapshot();
        });

        it('should return an array with unique objects based on a function', () => {
            const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
            expect(uniqueBy(arr, (item) => item.id.toString())).toMatchSnapshot();
        });

        it('should handle an empty array', () => {
            expect(uniqueBy([], 'id')).toEqual([]);
        });

        it('should handle an array with no duplicates', () => {
            const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            expect(uniqueBy(arr, 'id')).toMatchSnapshot();
        });
    });

    describe('getStorageKey', () => {
        it('should return the storage key with prefix, app, and name', () => {
            const options = new StoreOptions({ app: 'testApp', prefix: 'testPrefix', storage: 'local' });
            const state = new StoreState({ name: 'TestState', options: options });
            expect(getStorageKey(state)).toMatchSnapshot();
        });

        it('should return the storage key with only app and name if prefix is not provided', () => {
            const options = new StoreOptions({ app: 'testApp', storage: 'session' });
            const state = new StoreState({ name: 'TestState', options: options });
            expect(getStorageKey(state)).toMatchSnapshot();
        });

        it('should return the storage key with only prefix and name if app is not provided', () => {
            const options = new StoreOptions({ prefix: 'testPrefix', storage: 'local' });
            const state = new StoreState({ name: 'TestState', options: options });
            expect(getStorageKey(state)).toMatchSnapshot();
        });

        it('should return the storage key with only name if prefix and app are not provided', () => {
            const options = new StoreOptions({ storage: 'local' });
            const state = new StoreState({ name: 'TestState', options: options });
            expect(getStorageKey(state)).toMatchSnapshot();
        });

        it('should return storage none and empty key if storage is not provided', () => {
            const options = new StoreOptions({});
            const state = new StoreState({ name: 'TestState', options: options });
            expect(getStorageKey(state)).toMatchSnapshot();
        });

        it('should return storage none and empty key if options is not provided', () => {
            const state = new StoreState({ name: 'TestState' });
            expect(getStorageKey(state)).toMatchSnapshot();
        });
    });
});