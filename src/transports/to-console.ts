import { q$, qfun, qprop } from '@jujulego/quick-tag';

import { Log, LogFormat, LogLevel, LogReceiver } from '../defs/index.js';

// Format
export const consoleFormat = qfun<Log>`#?:${qprop('label')}[${q$}] ?#${qprop('message')}`;

// Builder
export function toConsole(): LogReceiver<Log>;
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
