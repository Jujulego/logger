import { Observable, source$ } from '@jujulego/event-tree';

import { Log, LogLevel, LogLevelKey, parseLogLevel } from './defs/index.js';

// Types
export type LoggerFn<L extends Log = Log> = (log: Log) => L;

export interface Logger<L extends Log = Log> extends Observable<L> {
  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   *
   * @param fn
   */
  child<CL extends Log>(fn: LoggerFn<CL>): Logger<CL>;

  /**
   * Logs a message with a custom level
   *
   * @param level
   * @param message
   * @param error
   */
  log(level: LogLevel | LogLevelKey, message: string, error?: Error): void;

  debug(message: string): void;
  verbose(message: string): void;
  info(message: string): void;
  warning(message: string, error?: Error): void;
  error(message: string, error?: Error): void;
}

// Builder
export function logger$(): Logger;
export function logger$<L extends Log = Log>(fn: LoggerFn<L>): Logger<L>;
export function logger$(fn: LoggerFn = (log) => log): Logger {
  const src = source$<Log>();

  function emit(log: Log): void {
    src.next(fn(log));
  }

  return Object.assign(src, {
    // utils methods
    child<CL extends Log>(childFn: LoggerFn<CL>) {
      const child = logger$(childFn);
      child.subscribe(emit);

      return child;
    },

    // log methods
    log: (level: LogLevel | LogLevelKey, message: string, error?: Error) => emit({ level: parseLogLevel(level), message, error }),

    debug:   (message: string) => emit({ level: LogLevel.debug,   message }),
    verbose: (message: string) => emit({ level: LogLevel.verbose, message }),
    info:    (message: string) => emit({ level: LogLevel.info,    message }),
    warning: (message: string, error?: Error) => emit({ level: LogLevel.warning, message, error }),
    error:   (message: string, error?: Error) => emit({ level: LogLevel.error,   message, error }),
  });
}
