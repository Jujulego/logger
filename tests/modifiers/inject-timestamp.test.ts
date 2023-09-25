import { vi } from 'vitest';

import { LogLevel } from '@/src/defs/log-levels.js';
import { logger$ } from '@/src/logger.js';
import { injectTimestamp } from '@/src/modifiers/inject-timestamp.js';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('injectTimestamp', () => {
  it('should inject label to each emitted logs', () => {
    vi.setSystemTime('2023-09-26T00:00:00.000Z');

    const spy = vi.fn();

    const logger = logger$(injectTimestamp());
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      timestamp: '2023-09-26T00:00:00.000Z',
      message: 'life is 42'
    });
  });
});
