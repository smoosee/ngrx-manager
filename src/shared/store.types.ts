import { Observable } from "rxjs";
import { StoreAction } from "../models/store.action";
import { UpdateFlag } from "../models/store.options";
import { IStoreState } from "../models/store.state";
import { DefaultActions } from "./store.enums";

export type StateKey<S extends readonly IStoreState[]> = S[number]['name'];
export type State<S extends readonly IStoreState[], K extends StateKey<S>> = Extract<S[number], { name: K; }>;
export type StateData<S extends IStoreState> = S['initial'];

export type StateActions<S extends IStoreState> = S['actions'] extends ArrayLike<any> ? S['actions'] : never;
export type StateServiceActions<S extends IStoreState> = undefined extends S['service'] ? never : S['service'] extends ServiceClass<any> ? ServiceActions<InstanceType<S['service']>> : never;
export type AllStateActions<S extends IStoreState> = StateServiceActions<S> extends never ? StateActions<S> : StateServiceActions<S> | StateActions<S>;
export type StateActionNames<S extends IStoreState> = AllStateActions<S>[number]['name'];

export type ActionKey<S extends IStoreState, N extends string> = N extends (StateActionNames<S> | DefaultActions) ? N : never;
export type StateAction<S extends IStoreState, N extends StateActionNames<S>> = Extract<AllStateActions<S>[number], { name: N }>;

export type StateActionPayload<S extends IStoreState, N extends StateActionNames<S>, A extends StateAction<S, N> = StateAction<S, N>> = A['name'] extends DefaultActions ? DeepPartial<StateData<S>> | undefined : MethodArguments<InstanceType<A['service']>, A['method']>;
export type StateActionReturn<S extends IStoreState, N extends StateActionNames<S>, A extends StateAction<S, N> = StateAction<S, N>> = MethodReturnType<InstanceType<A['service']>, A['method']>;

export type DispatchArguments<S extends IStoreState, N extends StateActionNames<S>> = undefined extends StateActionPayload<S, N> ? [DispatchPayload<S, N>?, UpdateFlag?] : [DispatchPayload<S, N>, UpdateFlag?];
export type DispatchPayload<S extends IStoreState, N extends StateActionNames<S>> = StateActionPayload<S, N> extends undefined ? DeepPartial<StateData<S>> | string | number | boolean : StateActionPayload<S, N>;
export type DispatchResponse<S extends IStoreState, N extends StateActionNames<S>, R = StateActionReturn<S, N>> = N extends keyof typeof DefaultActions ? StateData<S> : `Object` extends R ? StateData<S> : StateData<S> & R;

export type StateFormatter<S extends IStoreState> = (payload: StateData<S>) => StateData<S>;


export type Service = unknown;
export type ServiceClass<S extends Service> = new (...args: any[]) => S;
export type ServiceMethod<S extends Service, K extends keyof S = keyof S> = K extends string ? S[K] extends Function ? K : never : never;
export type ServiceActions<S extends Service> = { [K in ServiceMethod<S>]: StoreAction<CamelToSnakeCase<K>, S, K> }[ServiceMethod<S>][];
export type MethodArguments<S extends Service, M extends keyof S> = S[M] extends (...args: any[]) => any ? Parameters<S[M]>[0] : never;
export type MethodReturnType<S extends Service, M extends keyof S> = S[M] extends (...args: any[]) => any ? (ReturnType<S[M]> extends Observable<infer R> ? R : ReturnType<S[M]>) : never;

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };
export type RequireOnly<T, R extends keyof T> = Required<Pick<T, R>> & Partial<Omit<T, R>>;

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}` ? `${T extends Capitalize<T> ? "_" : ""}${Uppercase<T>}${CamelToSnakeCase<U>}` : S;
