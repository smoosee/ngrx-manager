import { InjectionToken } from "@angular/core";

export const STORE_OPTIONS = new InjectionToken('STORE_OPTIONS');
export const STATE_CONFIG = new InjectionToken('STATE_CONFIG');

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
}

export enum ActionStatus {
  NEW = 'NEW',
  GET = 'GET',
  SET = 'SET',
  EXTEND = 'EXTEND',
  UNSET = 'UNSET',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
