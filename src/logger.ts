import { Observable, source$ } from '@jujulego/event-tree';
import { qstr, QuickConst } from '@jujulego/quick-tag';

import { Log, LogLevel, LogLevelKey, LogModifier as LM, parseLogLevel } from './defs/index.js';

// Types
export type LeveledLogArgs = [message: string, error?: Error | undefined];
export type LeveledLogTagArgs = [strings: TemplateStringsArray, ...args: QuickConst[]];

// Builder
/**
 * Builds a logger using given modifiers
 */
export function logger$(): Logger;
export function logger$<A extends Log>(fnA: LM<Log, A>): Logger<A>;
export function logger$<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;
export function logger$<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;
export function logger$<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;
export function logger$(...fns: LM[]): Logger;

export function logger$(...fns: LM[]): Logger {
  return new Logger((log) => fns.reduce((acc, fn) => fn(acc), log));
}

// Class
export class Logger<L extends Log = Log> implements Observable<L> {
  // Attributes
  private readonly _source = source$<L>();
  private readonly _modifier: LM<Log, L>;

  // Constructor
  constructor(modifier: LM<Log, L> = (log) => log as L) {
    this._modifier = modifier;
  }

  // Methods
  private readonly _next = (log: Log) => this._source.next(this._modifier(log));

  readonly subscribe = this._source.subscribe;
  readonly unsubscribe = this._source.unsubscribe;
  readonly clear = this._source.clear;

  /**
   * Creates a child logger. Every log emitted by the children will be emitted by it's parent
   */
  child(): Logger;
  child<A extends Log>(fnA: LM<Log, A>): Logger<A>;
  child<A extends Log, B extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>): Logger<B>;
  child<A extends Log, B extends Log, C extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>): Logger<C>;
  child<A extends Log, B extends Log, C extends Log, D extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>): Logger<D>;
  child<A extends Log, B extends Log, C extends Log, D extends Log, E extends Log>(fnA: LM<Log, A>, fnB: LM<A, B>, fnC: LM<B, C>, fnD: LM<C, D>, fnE: LM<D, E>): Logger<E>;
  child(...fns: LM[]): Logger;

  child(...fns: LM[]) {
    const child = logger$(...fns);
    child.subscribe(this._next);

    return child;
  }

  /**
   * Sends a log with a custom level
   */
  log(level: LogLevel | LogLevelKey, message: string, error?: Error): void {
    this._next({ level: parseLogLevel(level), message, error });
  }

  private _leveledLog(level: LogLevel, args: LeveledLogArgs | LeveledLogTagArgs): void {
    if (Array.isArray(args[0])) {
      const [strings, ...rest] = args as LeveledLogTagArgs;

      this._next({ level, message: qstr(strings, ...rest) });
    } else {
      const [message, error] = args as LeveledLogArgs;

      this._next({ level, message, error });
    }
  }

  /**
   * Logs a debug message
   */
  debug(message: string, error?: Error): void;
  debug(strings: TemplateStringsArray, ...args: QuickConst[]): void;

  debug(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.debug, args);
  }

  /**
   * Logs a verbose message
   */
  verbose(message: string, error?: Error): void;
  verbose(strings: TemplateStringsArray, ...args: QuickConst[]): void;

  verbose(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.verbose, args);
  }

  /**
   * Logs a info message
   */
  info(message: string, error?: Error): void;
  info(strings: TemplateStringsArray, ...args: QuickConst[]): void;

  info(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.info, args);
  }

  /**
   * Logs a warning message
   */
  warning(message: string, error?: Error): void;
  warning(strings: TemplateStringsArray, ...args: QuickConst[]): void;

  warning(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.warning, args);
  }

  /**
   * Logs a error message
   */
  error(message: string, error?: Error): void;
  error(strings: TemplateStringsArray, ...args: QuickConst[]): void;

  error(...args: LeveledLogArgs | LeveledLogTagArgs): void {
    this._leveledLog(LogLevel.error, args);
  }
}
