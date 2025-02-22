import { StoreOptions } from './store.options';

describe('StoreOptions', () => {
  it('should create a StoreOptions instance with default values', () => {
    const options = new StoreOptions();
    expect(options.app).toBeUndefined();
    expect(options.prefix).toBeUndefined();
    expect(options.storage).toBe('none');
    expect(options.flags).toEqual({ onSet: 'replace', onDispatch: 'extend' });
  });

  it('should create a StoreOptions instance with provided values', () => {
    const options = new StoreOptions({
      app: 'testApp',
      prefix: 'testPrefix',
      storage: 'local',
      flags: { onSet: 'extend', onDispatch: 'override' },
    });

    expect(options.app).toBe('testApp');
    expect(options.prefix).toBe('testPrefix');
    expect(options.storage).toBe('local');
    expect(options.flags).toEqual({ onSet: 'extend', onDispatch: 'override' });
  });

  it('should assign provided options to the instance', () => {
    const initialOptions = { app: 'initialApp', prefix: 'initialPrefix' };
    const options = new StoreOptions(initialOptions);

    expect(options.app).toBe('initialApp');
    expect(options.prefix).toBe('initialPrefix');
  });

  it('should handle undefined options gracefully', () => {
    const options = new StoreOptions(undefined);

    expect(options.app).toBeUndefined();
    expect(options.prefix).toBeUndefined();
  });

});