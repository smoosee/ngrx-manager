export type StateKey<S extends readonly any[]> = S[number]['name'];
export type StateData<S extends readonly any[], K extends StateKey<S>> = Extract<S[number], { name: K; }>['initial'];
export type StateActions<S extends readonly any[], K extends StateKey<S>> = Extract<S[number], { name: K; }>['actions'];
export type StateActionPayload<S extends readonly any[], K extends StateKey<S>, A extends ActionNames<S, K>> = Extract<StateActions<S, K>[number], { name: A }>['payload'];
export type ActionNames<S extends readonly any[], K extends StateKey<S>> = StateActions<S, K>[number]['name'];
export type DeprecatedActions<S extends readonly any[], K extends StateKey<S>> = Extract<StateActions<S, K>[number], { deprecated: true; }>['name'];
export type ActiveActions<S extends readonly any[], K extends StateKey<S>> = Exclude<StateActions<S, K>[number]['name'], DeprecatedActions<S, K>>;

export type DispatchPayload<S extends readonly any[], K extends StateKey<S>, A extends ActionNames<S, K>> = StateActionPayload<S, K, A> extends undefined ? DeepPartial<StateData<S, K>> | string | number | boolean : DeepPartial<StateActionPayload<S, K, A>>;
export type StateFormatter<S extends readonly any[], K extends StateKey<S>> = (payload: StateData<S, K>) => StateData<S, K>;


export type ActionService = any;
export type ActionMethod<S extends ActionService> = keyof S;
export type ActionPayload<S extends ActionService, M extends keyof S> = S[M] extends (...args: any[]) => any ? Parameters<S[M]>[0] : never;

export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]; };
export type RequireOnly<T, R extends keyof T> = Required<Pick<T, R>> & Partial<Omit<T, R>>;