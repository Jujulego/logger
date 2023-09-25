import { vi } from 'vitest';

import { LogLevel } from '@/src/defs/log-levels.js';
import { logger$ } from '@/src/logger.js';
import { injectLabel } from '@/src/modifiers/index.js';

// Tests
describe('injectLabel', () => {
  it('should inject label to each emitted logs', () => {
    const spy = vi.fn();

    const logger = logger$(injectLabel('test'));
    logger.subscribe(spy);

    logger.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'test',
      message: 'life is 42'
    });
  });

  it('should not inject parent label has modifier is lazy (by default)', () => {
    const spy = vi.fn();

    const logger = logger$(injectLabel('test'));
    const child = logger.child(injectLabel('child'));
    logger.subscribe(spy);

    child.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'child',
      message: 'life is 42'
    });
  });

  it('should inject parent label has modifier is force', () => {
    const spy = vi.fn();

    const logger = logger$(injectLabel('test', true));
    const child = logger.child(injectLabel('child'));
    logger.subscribe(spy);

    child.info('life is 42');

    expect(spy).toHaveBeenCalledWith({
      level: LogLevel.info,
      label: 'test',
      message: 'life is 42'
    });
  });
});
