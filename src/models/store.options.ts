export type UpdateFlag = 'extend' | 'override' | 'replace';

type StoreFlags = {
  onSet?: UpdateFlag;
  onDispatch?: UpdateFlag;
}

export class StoreOptions<T = any> {
  app?: string;
  prefix?: string;
  storage?: 'local' | 'session' | 'none' = 'none';
  flags?: StoreFlags = {
      onSet: 'replace',
      onDispatch: 'extend',
    };


  constructor(options?: StoreOptions) {
    Object.assign(this, options);
  }
}
