export type StoreFlags = {
  extendOnSet?: boolean;
  extendOnDispatch?: boolean;
  mergeArrays?: boolean;
}

export class StoreOptions<T = any> {
  app?: string;
  prefix?: string;
  storage?: 'local' | 'session' | 'none' = 'none';
  flags?: StoreFlags = {
    extendOnSet: false,
    extendOnDispatch: true
  };

  effects?: T;

  constructor(options?: StoreOptions) {
    Object.assign(this, options);
  }
}
