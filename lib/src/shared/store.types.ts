export type StateKey<S extends readonly any[]> = S[number]['name'];
export type StateData<S extends readonly any[], K extends StateKey<S>> = Extract<S[number], { name: K; }>['initial'];
export type StateActions<S extends readonly any[], K extends StateKey<S>> = Extract<S[number], { name: K; }>['actions'];
export type ActionNames<S extends readonly any[], K extends StateKey<S>> = StateActions<S, K>[number]['name'];
export type DeprecatedActions<S extends readonly any[], K extends StateKey<S>> = Extract<StateActions<S, K>[number], { deprecated: true; }>['name'];
export type ActiveActions<S extends readonly any[], K extends StateKey<S>> = Exclude<ActionNames<S, K>[number], { name: DeprecatedActions<S, K>; }>['name'];
export type StateFormatter<S extends readonly any[], K extends StateKey<S>> = (payload: StateData<S, K>) => StateData<S, K>;
