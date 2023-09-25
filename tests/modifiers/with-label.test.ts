import { vi } from 'vitest';

import { LogLevel } from '@/src/defs/log-levels.js';
import { logger$ } from '@/src/logger.js';
import { withLabel } from '@/src/modifiers/with-label.js';

// Tests
describe('withLabel', () => {
  it('should inject label to each emitted logs', () => {
    const spy = vi.fn();

    const logger = logger$(withLabel('test'));
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'test',
      message: 'life is 42'
    });
  });

  it('should not inject label if one is already present', () => {
    const spy = vi.fn();

    const logger = logger$(
      withLabel('first'),
      withLabel('second')
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'first',
      message: 'life is 42'
    });
  });

  it('should force inject "second" label', () => {
    const spy = vi.fn();

    const logger = logger$(
      withLabel('first'),
      withLabel('second', true)
    );
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'second',
      message: 'life is 42'
    });
  });
});
