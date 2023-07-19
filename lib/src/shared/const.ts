export interface StoreOptions {
    app?: string;
    prefix?: string;
    storage?: 'local' | 'session' | 'none';
  }
  
  export enum ActionKeys {
    success = '*success',
    uuid = '*uuid',
    timestamp = '*timestamp',
    pending = '*pending',
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
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
  }
  