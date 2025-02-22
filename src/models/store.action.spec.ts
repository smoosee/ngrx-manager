import { ActionStatus } from '../shared/store.enums';
import { StoreAction } from './store.action';

describe('StoreAction', () => {
  it('should create a StoreAction instance with name only', () => {
    const action = new StoreAction('TEST_ACTION');
    expect(action.name).toBe('TEST_ACTION');
  });

  it('should create a StoreAction instance with full configuration', () => {
    const action = new StoreAction({
      name: 'FULL_ACTION',
      service: {} as any,
      method: 'testMethod' as any,
    }, 'TestState');

    expect(action.name).toBe('FULL_ACTION');
    expect(action.service).toEqual({});
    expect(action.method).toBe('testMethod');
    expect(action.state).toBe('TestState');
    expect(action.status).toBe(ActionStatus.PENDING);
  });

  it('should set default values when configuration is incomplete', () => {
    const action = new StoreAction({ name: 'INCOMPLETE_ACTION', service: {} as any, method: 'anotherTestMethod' as any });
    expect(action.name).toBe('INCOMPLETE_ACTION');
    expect(action.status).toBe(ActionStatus.PENDING);
  });

  it('should generate a type string based on state, name, and status', () => {
    const action = new StoreAction({ name: 'TYPE_ACTION', service: {} as any, method: 'yetAnotherTestMethod' as any }, 'TypeState');
    action.status = ActionStatus.SUCCESS;
    expect(action.type).toBe('[TypeState] TYPE_ACTION_DATA_SUCCESS');
  });

  it('should update payload and status when dispatch is called', () => {
    const action = new StoreAction({ name: 'DISPATCH_ACTION', service: {} as any, method: 'aTestMethod' as any });
    const payload = { data: 'test' };
    action.dispatch(payload, ActionStatus.PENDING);

    expect(action.payload).toEqual(payload);
    expect(action.status).toBe(ActionStatus.PENDING);
    expect(action.uuid).toBeDefined();
  });

  it('should generate a random UUID when created', () => {
    const action1 = new StoreAction({ name: 'UUID_ACTION_1', service: {} as any, method: 'test' as any });
    const action2 = new StoreAction({ name: 'UUID_ACTION_2', service: {} as any, method: 'test2' as any });
    expect(action1.uuid).toBeDefined();
    expect(action2.uuid).toBeDefined();
    expect(action1.uuid).not.toBe(action2.uuid);
  });
});