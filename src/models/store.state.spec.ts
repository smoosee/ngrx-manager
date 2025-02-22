import { StoreAction } from "./store.action";
import { StoreOptions } from "./store.options";
import { StoreReducer } from "./store.reducer";
import { StoreState } from "./store.state";

describe('StoreState', () => {
  it('should create a StoreState instance with default values', () => {
    const state = new StoreState({ name: 'TestState' });
    expect(state.name).toBe('TestState');
    expect(state.initial).toEqual({});
    expect(state.options).toEqual({});
    expect(state.reducers.length).toBe(3); // Default reducers
    expect(state.actions.length).toBeGreaterThan(0); // Default actions
  });

  it('should create a StoreState instance with provided values', () => {
    const options = new StoreOptions({ app: 'testApp' });
    const reducers = [new StoreReducer()];
    const actions = [new StoreAction('TEST_ACTION')];

    const state = new StoreState({
      name: 'TestState',
      initial: { data: 'initial' },
      options: options,
      reducers: reducers,
      actions: actions,
    });

    expect(state.name).toBe('TestState');
    expect(state.initial).toEqual({ data: 'initial' });
    expect(state.service).toBeUndefined();
    expect(state.options).toEqual(options);
    expect(state.reducers).toEqual(reducers);
    expect(state.actions).toEqual(actions);
  });
});
