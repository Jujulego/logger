/* eslint-disable no-console */
import { filter$, flow$ } from '@jujulego/aegis';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import { vi } from 'vitest';

import { logger$, LogLevel, toConsole, withLabel, withTimestamp } from '@/src/index.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime('2023-09-26T00:00:00.000Z');

  // Mock console
  vi.spyOn(console, 'error').mockReturnValue();
  vi.spyOn(console, 'warn').mockReturnValue();
  vi.spyOn(console, 'log').mockReturnValue();
  vi.spyOn(console, 'debug').mockReturnValue();
});

afterEach(() => {
  vi.useRealTimers();
});

// Tests
it('should print a complete log but only with at least info level', () => {
  // Create logger
  const logger = logger$(
    withLabel('life'),
    withTimestamp(),
  );

  // Connect to transport
  flow$(
    logger,
    filter$((log) => log.level >= LogLevel.info),
    toConsole(),
  );

  // Error level
  logger.error('test error');
  expect(console.error).toHaveBeenCalledWith(chalk.red(chalkTemplate`{grey 2023-09-26T00:00:00.000Z - }[life] test error`));

  // Warning level
  logger.warning('test warning');
  expect(console.warn).toHaveBeenCalledWith(chalk.yellow(chalkTemplate`{grey 2023-09-26T00:00:00.000Z - }[life] test warning`));

  // Info level
  logger.info('test info');
  expect(console.log).toHaveBeenCalledWith(chalkTemplate`{grey 2023-09-26T00:00:00.000Z - }[life] test info`);

  // Verbose level
  logger.verbose('test verbose');
  expect(console.log).not.toHaveBeenCalledWith(chalkTemplate`{grey 2023-09-26T00:00:00.000Z - }[life] test verbose`);

  // Debug level
  logger.error('test debug');
  expect(console.debug).not.toHaveBeenCalledWith(chalkTemplate`{grey 2023-09-26T00:00:00.000Z - }[life] test debug`);
});
