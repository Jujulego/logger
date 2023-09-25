import { vi } from 'vitest';

import { LogLevel } from '@/src/defs/log-levels.js';
import { logger$ } from '@/src/logger.js';
import { withTimestamp } from '@/src/modifiers/with-timestamp.js';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('withTimestamp', () => {
  it('should inject timestamp to each emitted logs', () => {
    vi.setSystemTime('2023-09-26T00:00:00.000Z');

    const spy = vi.fn();

    const logger = logger$(withTimestamp());
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      timestamp: '2023-09-26T00:00:00.000Z',
      message: 'life is 42'
    });
  });

  it('should not inject timestamp to emitted logs if one is already present', () => {
    vi.setSystemTime('2023-09-26T00:00:00.000Z');

    const spy = vi.fn();

    const logger = logger$(
      (log) => ({ ...log, timestamp: 'test' }),
      withTimestamp()
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      timestamp: 'test',
      message: 'life is 42'
    });
  });
});
