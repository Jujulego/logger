import { Observable } from '@jujulego/event-tree';

import { Log } from './log.js';
import { LogLevel, LogLevelKey } from './log-level.js';
import { LogModifier as LM } from './log-modifier.js';

// Types
export interface Logger<L extends Log = Log> extends Observable<L> {
  // Utils
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

  // Messages
  /**
   * Logs a message with a custom level
   */
  log(level: LogLevel | LogLevelKey, message: string, error?: Error): void;

  /**
   * Logs a debug message
   */
  debug(message: string): void;

  /**
   * Logs a verbose message
   */
  verbose(message: string): void;

  /**
   * Logs an info message
   */
  info(message: string): void;

  /**
   * Logs a warn message
   */
  warning(message: string, error?: Error): void;

  /**
   * Logs an error message
   */
  error(message: string, error?: Error): void;
}
