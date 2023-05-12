import { InjectionToken } from "@angular/core";
import { StateConfig } from "./models";

export const STORE_OPTIONS = new InjectionToken('STORE_OPTIONS');
export const STATE_CONFIG = new InjectionToken('STATE_CONFIG');

export type StateConfigs = Partial<StateConfig<any>>[];

export interface StoreOptions {
  app?: string;
  prefix?: string;
  storage?: 'local' | 'session' | 'none';
}

export enum ActionKeys {
  success = '*success',
  timestamp = '*timestamp',
  triggered = '*triggered',
  unset = '*unset',
  error = '*error',
  cached = '*cached',
}

export enum DefaultActions {
  GET = 'GET',
  SET = 'SET',
  EXTEND = 'EXTEND',
  UNSET = 'UNSET',
}

export enum ActionStatus {
  NONE = 'NONE',
  NEW = 'NEW',
  TRIGGERED = 'TRIGGERED',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
