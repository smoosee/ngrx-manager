import { ActionStatus, DefaultActions } from "../shared/store.enums";


type RequireOnly<T, R extends keyof T> = Required<Pick<T, R>> & Partial<Omit<T, R>>;

interface StoreActionProps<T = any, K extends string = string, D extends boolean = boolean, F extends string = string> {
  name: K;
  state: string;

  service: new (...args: any[]) => T;
  method: keyof T;

  deprecated: D;
  fallback: F[];

  payload: any;

  uuid: string;
  status: ActionStatus;
}

type StoreActionInput<T = any, K extends string = string, D extends boolean = boolean, F extends string = string> =
  | RequireOnly<StoreActionProps<T, K, D, F>, 'name' | 'fallback'>
  | RequireOnly<StoreActionProps<T, K, D, F>, 'name' | 'service' | 'method'>
  | Partial<StoreActionProps<T, K, D, F>>;

export class StoreAction<T = any, K extends string = string, D extends boolean = boolean, F extends string = string> {
  name!: K;
  state?: string;

  service?: new (...args: any[]) => T;
  method?: keyof T;
  fallback?: F[];
  payload?: any;
  uuid?: string;
  status?: ActionStatus = undefined as any;

  deprecated?: boolean;


  get type() {
    return `[${this.state}] ${this.name}_DATA_${this.status}`;
  }

  constructor(action: StoreActionInput<T, K, D, F>, state?: string) {
    this.state = state;
    this.uuid = action?.uuid || Math.random().toString(36).substr(2, 9);

    if (typeof action === 'string') {
      this.name = action;
      this.deprecated = this.deprecated || false as D;
    } else if (action) {
      this.name = action.name || (DefaultActions.SET as K);
      this.service = action.service;
      this.method = action.method;
      this.fallback = action.fallback || [];
      this.payload = action.payload;
      this.status = action.status || ActionStatus.PENDING;
      this.deprecated = action.deprecated || false as D;
    }

  }

  dispatch(payload: any, newStatus = ActionStatus.PENDING) {
    this.payload = payload;
    this.status = newStatus;
    return this;
  }
}
