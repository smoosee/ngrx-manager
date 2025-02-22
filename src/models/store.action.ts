import { ActionStatus, DefaultActions } from "../shared/store.enums";
import { MethodArguments, RequireOnly, Service, ServiceClass, ServiceMethod } from "../shared/store.types";
import { UpdateFlag } from "./store.options";



type StoreActionInput<N extends string, S extends Service, M extends ServiceMethod<S>> =
  | RequireOnly<StoreAction<N, S, M>, 'name' | 'service' | 'method'>
  | Partial<StoreAction<N, S, M>>;


export class StoreAction<N extends string = string, S extends Service = Service, M extends ServiceMethod<S> = ServiceMethod<S>> {
  name!: N;
  state?: string;

  service!: ServiceClass<S>;
  method!: M;
  payload?: MethodArguments<S, M>;
  uuid?: string;
  status?: ActionStatus = undefined as any;

  flag?: UpdateFlag;


  get type() {
    return `[${this.state}] ${this.name}_DATA_${this.status}`;
  }

  constructor(action: string | StoreActionInput<N, S, M>, state?: string) {
    this.state = state;

    if (typeof action === 'string') {
      this.name = action as N;
      this.uuid = Math.random().toString(36).substr(2, 9);
      this.status = ActionStatus.PENDING;
    } else if (action) {
      this.uuid = action?.uuid || Math.random().toString(36).substr(2, 9);
      this.name = action.name || (DefaultActions.SET as N);
      this.service = action.service!;
      this.method = action.method!;
      this.payload = action.payload;
      this.status = action.status || ActionStatus.PENDING;
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
