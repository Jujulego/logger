import { vi } from 'vitest';

import { logger$ } from '@/src/logger.js';
import { toConsole } from '@/src/transports/to-console.js';

// Tests
describe('toConsole', () => {
  it('should print log in console', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const logger = logger$();
    logger.subscribe(toConsole().next);
    logger.info('life');

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('life');
  });

  it('should print log in console including label and timestamp', () => {
    vi.spyOn(console, 'log').mockReturnValue();

    const logger = logger$(
      (log) => ({ ...log, label: 'test', timestamp: 'today' })
    );
    logger.subscribe(toConsole().next);
    logger.info('life');

    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledWith('today - [test] life');
  });
});
