import { Injectable } from "@angular/core";
import { StateConfig, StoreOptions } from "../models";

export interface StateOptions<T> {
    name: string;
    initial?: T;
    options?: StoreOptions;
}

const states: { [key: string]: StateConfig<any> } = {};


export function State<T>(options: StateOptions<T>) {
    return (target: any) => {
        return target;
    };
}


export function Action(name: String) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        console.log(target, propertyKey, descriptor);
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const result = originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };

}