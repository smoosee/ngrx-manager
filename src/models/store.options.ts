export class StoreOptions<T = any> {
  app?: string;
  prefix?: string;
  storage?: 'local' | 'session' | 'none' = 'none';
  extendOnSet?: boolean = false;
  extendOnDispatch?: boolean = true;
  mergeDeepOnExtend?: boolean = false;
  effects?: T;

  constructor(options?: StoreOptions) {
    Object.assign(this, options);
  }
}
