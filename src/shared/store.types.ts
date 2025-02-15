import { Observable } from "rxjs";
import { StoreAction } from "../models/store.action";
import { StoreState } from "../models/store.state";
import { DefaultActions } from "./store.enums";

export type StateKey<S extends StoreState[]> = S[number]['name'];
export type State<S extends StoreState[], K extends StateKey<S>> = Extract<S[number], { name: K; }>;
export type StateData<S extends StoreState> = S['initial'];
export type StateActions<S extends StoreState> = S['actions'];
export type StateActionNames<S extends StoreState> = S['actions'][number]['name'] | keyof typeof DefaultActions;
export type StateAction<S extends StoreState, N extends StateActionNames<S>> = Extract<StateActions<S>[number], { name: N }>;

export type StateActionPayload<A extends StoreAction> = A['payload'];
export type StateActionReturn<A extends StoreAction> = ActionResponse<InstanceType<A['service']>, A['method']>;
export type DeprecatedActions<S extends StoreState> = Extract<StateActions<S>[number], { deprecated: true; }>['name'];
export type ActiveActions<S extends StoreState> = Exclude<StateActions<S>[number]['name'], DeprecatedActions<S>>;

export type DispatchPayload<S extends StoreState, N extends StateActionNames<S>, A extends StoreAction = StateAction<S, N>> = StateActionPayload<A> extends undefined ? DeepPartial<StateData<S>> | string | number | boolean : DeepPartial<StateActionPayload<A>>;
export type DispatchResponse<S extends StoreState, N extends StateActionNames<S>, A extends StoreAction = StateAction<S, N>, R = StateActionReturn<A>> = N extends keyof typeof DefaultActions ? StateData<S> : `Object` extends R ? StateData<S> : StateData<S> & R;

export type StateFormatter<S extends StoreState> = (payload: StateData<S>) => StateData<S>;


export type ActionService = any;
export type ActionMethod<S extends ActionService> = keyof S;
export type ActionPayload<S extends ActionService, M extends keyof S> = S[M] extends (...args: any[]) => any ? Parameters<S[M]>[0] : never;
export type ActionResponse<S extends ActionService, M extends keyof S> = S[M] extends (...args: any[]) => any ? (ReturnType<S[M]> extends Observable<infer R> ? R : ReturnType<S[M]>) : never;

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };
export type RequireOnly<T, R extends keyof T> = Required<Pick<T, R>> & Partial<Omit<T, R>>;
