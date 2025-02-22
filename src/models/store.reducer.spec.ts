import { ActionStatus, DefaultActions, StateKeys } from '../shared/store.enums';
import { StoreAction } from './store.action';
import { StoreReducer } from './store.reducer';
import { StoreState } from './store.state';

describe('StoreReducer', () => {
  let reducer: StoreReducer;
  let state: StoreState;
  let action: StoreAction;
  let payload: any;

  beforeEach(() => {
    reducer = new StoreReducer();
    state = new StoreState({});
    payload = { data: 'initial' };
  });

  it('should return the original payload in getPayload', () => {
    const result = reducer.getPayload(state, payload, action);
    expect(result).toEqual(payload);
  });

  it('should return the original payload in prePopulate', () => {
    const result = reducer.prePopulate(state, payload, action);
    expect(result).toEqual(payload);
  });

  it('should return the original payload in postPopulate', () => {
    const result = reducer.postPopulate(state, payload, action);
    expect(result).toEqual(payload);
  });

  describe('onPopulate', () => {
    it('should assign uuid and status to the payload', () => {
      action = new StoreAction({ name: 'TEST_ACTION', service: {} as any, method: 'testMethod' as any });
      action.status = ActionStatus.SUCCESS;
      const result = reducer.onPopulate(state, payload, action);
      expect(result[StateKeys.uuid]).toBe(action.uuid);
      expect(result[StateKeys.status]).toBe(action.status);
    });

    it('should set payload to {} when action is UNSET and status is SUCCESS', () => {
      action = new StoreAction({ name: DefaultActions.UNSET, service: {} as any, method: 'testMethod' as any });
      action.status = ActionStatus.SUCCESS;
      const result = reducer.onPopulate(state, payload, action);
      expect(result).toEqual({[StateKeys.uuid]: action.uuid, [StateKeys.status]: action.status});
    });

    it('should call getPayload when action is not UNSET, status is SUCCESS and payload exists', () => {
      const getPayloadSpy = jest.spyOn(reducer, 'getPayload');
      action = new StoreAction({ name: 'TEST_ACTION', service: {} as any, method: 'testMethod' as any });
      action.status = ActionStatus.SUCCESS;
      action.payload = {data: 'test'} as any;
      reducer.onPopulate(state, payload, action);
      expect(getPayloadSpy).toHaveBeenCalledWith(state, payload, action);
    });

    it('should not call getPayload when action is not UNSET, status is SUCCESS but payload does not exist', () => {
      const getPayloadSpy = jest.spyOn(reducer, 'getPayload');
      action = new StoreAction({ name: 'TEST_ACTION', service: {} as any, method: 'testMethod' as any });
      action.status = ActionStatus.SUCCESS;
      action.payload = undefined;
      reducer.onPopulate(state, payload, action);
      expect(getPayloadSpy).not.toHaveBeenCalled();
    });

    it('should still assign uuid and status even if action.payload is undefined', () => {
        action = new StoreAction({ name: 'TEST_ACTION', service: {} as any, method: 'testMethod' as any });
        action.status = ActionStatus.SUCCESS;
        action.payload = undefined;
        const result = reducer.onPopulate(state, payload, action);
        expect(result[StateKeys.uuid]).toBe(action.uuid);
        expect(result[StateKeys.status]).toBe(action.status);
    });

    it('should assign uuid and status even if action status is not success', () => {
      action = new StoreAction({ name: 'TEST_ACTION', service: {} as any, method: 'testMethod' as any });
      action.status = ActionStatus.PENDING;
      const result = reducer.onPopulate(state, payload, action);
      expect(result[StateKeys.uuid]).toBe(action.uuid);
      expect(result[StateKeys.status]).toBe(action.status);
    });
  });
});