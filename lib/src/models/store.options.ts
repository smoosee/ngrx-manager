export class StoreOptions<T = any> {
  app?: string;
  prefix?: string;
  storage?: 'local' | 'session' | 'none' = 'none';
  shouldExtend?: boolean = false;
  shouldMerge?: boolean = false
  enableTracing?: boolean = false
  effects?: T;

  constructor(options?: StoreOptions) {
    Object.assign(this, options);
  }
}
