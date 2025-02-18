import { Observable } from "rxjs";
import { StoreAction } from "../models/store.action";
import { UpdateFlag } from "../models/store.options";
import { StoreState } from "../models/store.state";
import { DefaultActions } from "./store.enums";

export type StateKey<S extends StoreState[]> = S[number]['name'];
export type State<S extends StoreState[], K extends StateKey<S>> = Extract<S[number], { name: K; }>;
export type StateData<S extends StoreState> = S['initial'];
export type StateActions<S extends StoreState, SV = InstanceType<S['service']>> = SV extends never ? S['actions'] : ServiceActions<SV> | S['actions'];
export type StateActionNames<S extends StoreState> = StateActions<S>[number]['name'];
export type ActionKey<S extends StoreState, N extends string> = N extends (StateActionNames<S> | DefaultActions) ? N : never;
export type StateAction<S extends StoreState, N extends StateActionNames<S>> = Extract<StateActions<S>[number], { name: N }>;

export type StateActionPayload<A extends StoreAction> = MethodArguments<InstanceType<A['service']>, A['method']>;
export type StateActionReturn<A extends StoreAction> = MethodReturnType<InstanceType<A['service']>, A['method']>;
export type DeprecatedActions<S extends StoreState> = Extract<StateActions<S>[number], { deprecated: true; }>['name'];
export type ActiveActions<S extends StoreState> = Exclude<StateActions<S>[number]['name'], DeprecatedActions<S>>;

export type DispatchArguments<S extends StoreState, N extends StateActionNames<S>, A extends StoreAction = StateAction<S, N>> = StateActionPayload<A> extends undefined ? [DispatchPayload<S, N>?, UpdateFlag?] : [DispatchPayload<S, N>, UpdateFlag?];
export type DispatchPayload<S extends StoreState, N extends StateActionNames<S>, A extends StoreAction = StateAction<S, N>> = StateActionPayload<A> extends undefined ? DeepPartial<StateData<S>> | string | number | boolean : StateActionPayload<A>;
export type DispatchResponse<S extends StoreState, N extends StateActionNames<S>, A extends StoreAction = StateAction<S, N>, R = StateActionReturn<A>> = N extends keyof typeof DefaultActions ? StateData<S> : `Object` extends R ? StateData<S> : StateData<S> & R;

export type StateFormatter<S extends StoreState> = (payload: StateData<S>) => StateData<S>;


export type Service = unknown;
export type ServiceClass<S extends Service> = new (...args: any[]) => S;
export type ServiceMethod<S extends Service> = { [K in keyof S]: S[K] extends (...args: any[]) => any ? K : never; }[keyof S];
export type ServiceActions<S extends Service> = { [K in ServiceMethod<S>]: StoreAction<CamelToSnakeCase<string & K>, S, string & K> }[ServiceMethod<S>][];
export type MethodArguments<S extends Service, M extends keyof S> = S[M] extends (...args: any[]) => any ? Parameters<S[M]>[0] : never;
export type MethodReturnType<S extends Service, M extends keyof S> = S[M] extends (...args: any[]) => any ? (ReturnType<S[M]> extends Observable<infer R> ? R : ReturnType<S[M]>) : never;

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };
export type RequireOnly<T, R extends keyof T> = Required<Pick<T, R>> & Partial<Omit<T, R>>;

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}` ? `${T extends Capitalize<T> ? "_" : ""}${Uppercase<T>}${CamelToSnakeCase<U>}` : S;
