import { qprop, QuickFun } from '@jujulego/quick-tag';
import chalkTemplate from 'chalk-template';
import chalk from 'chalk';

import { LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogLevel, LogTransport } from '../defs/index.js';
import { quick } from '../quick.js';

// Types
export type ConsoleLog = Log & Partial<LogLabel & LogTimestamp>;

// Format
const defaultFormat = quick.wrap(chalkTemplate)
  .function<ConsoleLog>`#?:${qprop('timestamp')}{grey #$ - }?##?:${qprop('label')}[#$] ?#${qprop('message')}`;

// Builder
export function toConsole(): LogTransport<ConsoleLog>;

export function toConsole<L extends Log>(format: QuickFun<L>): LogTransport<L>;

export function toConsole(format: QuickFun<Log> = defaultFormat): LogTransport<Log> {
  return {
    next(log) {
      const message = format(log);

      switch (log.level) {
        case LogLevel.error:
          console.error(chalk.red(message));
          break;

        case LogLevel.warning:
          console.warn(chalk.yellow(message));
          break;

        case LogLevel.info:
        case LogLevel.verbose:
          // eslint-disable-next-line no-console
          console.log(message);
          break;

        case LogLevel.debug:
          // eslint-disable-next-line no-console
          console.debug(message);
          break;
      }
    }
  };
}
