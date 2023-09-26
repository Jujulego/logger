import { Log, LogTransport } from '../defs/index.js';
import { LogLevel } from '../defs/log-level.js';

// Types
export interface ConsoleLog extends Log {
  label?: string;
  timestamp?: string;
}

// Builder
export function toConsole(): LogTransport<ConsoleLog> {
  return {
    next(log) {
      let message = log.message;

      if (log.label) {
        message = `[${log.label}] ${message}`;
      }

      if (log.timestamp) {
        message = `${log.timestamp} - ${message}`;
      }

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
