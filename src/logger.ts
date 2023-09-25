import { Observable, source$ } from '@jujulego/event-tree';

import { Log, LogLevel, LogLevelKey, LogModifier as LM, parseLogLevel } from './defs/index.js';

// Types
export interface Logger<L extends Log = Log> extends Observable<L> {
  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child(): Logger<L>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child<A extends Log>(fnA: LM<Log, A>): Logger<A>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child(...fns: LM[]): Logger;

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
export function logger$<A extends Log>(fnA: LM<Log, A>): Logger<A>;
export function logger$<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;
export function logger$<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;

export function logger$(...fns: LM[]): Logger;

export function logger$(...fns: LM[]): Logger {
  const src = source$<Log>();

  function emit(log: Log): void {
    src.next(fns.reduce((acc, fn) => fn(acc), log));
  }

  return Object.assign(src, {
    // utils methods
    child(...childFns: LM[]) {
      const child = logger$(...childFns);
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
