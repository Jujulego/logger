import { qprop } from '@jujulego/quick-tag';
import chalkTemplate from 'chalk-template';

import { LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogTransport } from '../defs/index.js';
import { quick } from '../quick.js';

// Types
export type ConsoleLog = Log & Partial<LogLabel & LogTimestamp>;

// Format
export const consoleFormat = quick.wrap(chalkTemplate)
  .function<ConsoleLog>`#?:${qprop('timestamp')}{grey #$ - }?##?:${qprop('label')}[#$] ?#${qprop('message')}`;

// Builder
export function toConsole(): LogTransport<ConsoleLog>;

export function toConsole<L extends Log>(format: LogFormat<L>): LogTransport<L>;

export function toConsole(format: LogFormat = consoleFormat): LogTransport<Log> {
  return {
    next(log) {
      const args: unknown[] = [format(log)];

      if (log.error) {
        args.push(log.error);
      }

      switch (log.level) {
        case LogLevel.error:
          console.error(...args);
          break;

        case LogLevel.warning:
          console.warn(...args);
          break;

        case LogLevel.info:
        case LogLevel.verbose:
          // eslint-disable-next-line no-console
          console.log(...args);
          break;

        case LogLevel.debug:
          // eslint-disable-next-line no-console
          console.debug(...args);
          break;
      }
    }
  };
}
