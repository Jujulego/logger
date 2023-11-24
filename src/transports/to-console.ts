import { qprop } from '@jujulego/quick-tag';

import { LogLabel } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogReceiver } from '../defs/index.js';
import { quick } from '../quick.js';

// Types
export type ConsoleLog = Log & Partial<LogLabel>;

// Format
export const consoleFormat = quick.function<ConsoleLog>`#?:${qprop('label')}[#$] ?#${qprop('message')}`;

// Builder
export function toConsole(): LogReceiver<ConsoleLog>;
export function toConsole<L extends Log>(format: LogFormat<L>): LogReceiver<L>;

export function toConsole(format: LogFormat = consoleFormat): LogReceiver<Log> {
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
