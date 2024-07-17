export enum StateKeys {
  status = '*status',
  uuid = '*uuid',
}

export enum DefaultActions {
  GET = 'GET',
  SET = 'SET',
  EXTEND = 'EXTEND',
  UNSET = 'UNSET',
}

export enum ActionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
