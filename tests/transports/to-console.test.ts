import { beforeEach, vi } from 'vitest';

import { logger$ } from '@/src/logger.js';
import { toConsole } from '@/src/transports/to-console.js';

// Setup
beforeEach(() => {
  vi.restoreAllMocks();
});

// Tests
describe('toConsole', () => {
  it('should print error log using console.error', () => {
    vi.spyOn(console, 'error').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.error('life');

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith('life');
  });

  it('should print info log using console.warn', () => {
    vi.spyOn(console, 'warn').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.warning('life');

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith('life');
  });

  it('should print info log using console.log', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.info('life');

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('life');
  });

  it('should print verbose log using console.log', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.verbose('life');

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('life');
  });

  it('should print debug log using console.debug', () => {
    vi.spyOn(console, 'debug').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.debug('life');

    // eslint-disable-next-line no-console
    expect(console.debug).toHaveBeenCalledWith('life');
  });

  it('should print log in console including label and timestamp', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const logger = logger$(
      (log) => ({ ...log, label: 'test' })
    );
    logger.subscribe(toConsole().next);
    logger.info('life');

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('[test] life');
  });

  it('should print log and error in console', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const error = new Error('Failed !');
    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.info('life', error);

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('life', error);
  });
});
