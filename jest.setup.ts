import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

global.console = {
    ...console,
    // uncomment to ignore a specific log level
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    warn: jest.fn(),
    // error: jest.fn(),
};

setupZoneTestEnv();