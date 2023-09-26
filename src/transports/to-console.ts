import { formatLabel, formatTimestamp, LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogTransport } from '../defs/index.js';
import { logFormat } from '../log-format.js';

// Types
export type ConsoleLog = Log & Partial<LogLabel & LogTimestamp>;

// Format
export function consoleFormat(): LogFormat<ConsoleLog> {
  return logFormat(formatLabel(), formatTimestamp());
}

// Builder
export function toConsole<L extends ConsoleLog>(format: LogFormat<L> = consoleFormat()): LogTransport<L> {
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
