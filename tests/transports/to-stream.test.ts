import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import os from 'node:os';
import { beforeEach, vi } from 'vitest';

import { logger$ } from '@/src/logger.js';
import { toStream } from '@/src/transports/to-stream.js';

// Setup
let stream: NodeJS.WritableStream;

beforeEach(() => {
  stream = {
    write: vi.fn() as NodeJS.WritableStream['write']
  } as NodeJS.WritableStream;
});

// Tests
describe('toStream', () => {
  it('should print error log using given stream', () => {
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.error('life');

    expect(stream.write).toHaveBeenCalledWith(chalk.red('error   - life') + os.EOL);
  });

  it('should print warning log using given stream', () => {
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.warning('life');

    expect(stream.write).toHaveBeenCalledWith(chalk.yellow('warning - life') + os.EOL);
  });

  it('should print info log using given stream', () => {
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.info('life');

    expect(stream.write).toHaveBeenCalledWith('info    - life' + os.EOL);
  });

  it('should print verbose log using given stream', () => {
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.verbose('life');

    expect(stream.write).toHaveBeenCalledWith(chalk.blue('verbose - life') + os.EOL);
  });

  it('should print debug log using given stream', () => {
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.debug('life');

    expect(stream.write).toHaveBeenCalledWith(chalk.grey('debug   - life') + os.EOL);
  });

  it('should print log using stream including label and timestamp', () => {
    const logger = logger$(
      (log) => ({ ...log, label: 'test', timestamp: 'today' })
    );
    logger.subscribe(toStream(stream).next);
    logger.verbose('life');

    expect(stream.write).toHaveBeenCalledWith(chalk.blue(chalkTemplate`{grey today - }verbose - [test] life`) + os.EOL);
  });

  it('should print log and error in console', () => {
    const error = new Error('Failed !');
    const logger = logger$();
    logger.subscribe(toStream(stream).next);
    logger.error('life', error);

    expect(stream.write).toHaveBeenCalledWith(chalk.red(`error   - life${os.EOL}${error.stack}`) + os.EOL);
  });
});
