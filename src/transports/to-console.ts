import { LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogLevel, LogTransport } from '../defs/index.js';
import { LogArg, logFormat, optional } from '../log-format.js';

// Types
export type ConsoleLog = Log & Partial<LogLabel & LogTimestamp>;

// Format
const consoleFormat = logFormat<ConsoleLog>`#?timestamp:${optional('timestamp')} - ?##?label:[${optional('label')}] ?#${'message'}`;

// Builder
export function toConsole<L extends Log = ConsoleLog>(strings?: TemplateStringsArray, ...args: (keyof L | LogArg<L>)[]): LogTransport<L> {
  const format = strings ? logFormat(strings, ...args) : consoleFormat;

  return {
    next(log) {
      const message = format(log);

      switch (log.level) {
        case LogLevel.error:
          console.error(message);
          break;

        case LogLevel.warning:
          console.warn(message);
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
