import { ActionStatus, DefaultActions } from "../shared/store.enums";
import { ActionMethod, ActionPayload, ActionService, RequireOnly } from "../shared/store.types";
import { UpdateFlag } from "./store.options";



type StoreActionInput<K extends string, S extends ActionService, M extends ActionMethod<S>, D extends boolean = boolean, F extends string = string> =
  | RequireOnly<StoreAction<K, S, M, D, F>, 'name' | 'fallback'>
  | RequireOnly<StoreAction<K, S, M, D, F>, 'name' | 'service' | 'method'>
  | Partial<StoreAction<K, S, M, D, F>>;


export class StoreAction<K extends string = string, S extends ActionService = ActionService, M extends ActionMethod<S> = ActionMethod<S>, D extends boolean = boolean, F extends string = string> {
  name!: K;
  state?: string;

  service?: new (...args: any[]) => S;
  method?: M;
  fallback?: F[];
  payload?: ActionPayload<S, M>;
  uuid?: string;
  status?: ActionStatus = undefined as any;

  flag?: UpdateFlag;
  deprecated!: D;


  get type() {
    return `[${this.state}] ${this.name}_DATA_${this.status}`;
  }

  constructor(action: StoreActionInput<K, S, M, D, F>, state?: string) {
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
      this.flag = action.flag;
    }

  }

  dispatch(payload: any, newStatus = ActionStatus.PENDING) {
    this.payload = payload;
    this.status = newStatus;
    this.uuid = Math.random().toString(36).substr(2, 9);
    return this;
  }
}
