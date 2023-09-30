import { source$ } from '@jujulego/event-tree';
import { qstr, QuickConst } from '@jujulego/quick-tag';

import { Log, Logger, LogLevel, LogLevelKey, LogModifier as LM, parseLogLevel } from './defs/index.js';

// Utils
function isTmplStringArray(arr: unknown): arr is TemplateStringsArray {
  return Array.isArray(arr);
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

    debug(message: string | TemplateStringsArray, ...args: QuickConst[]) {
      if (isTmplStringArray(message)) {
        message = qstr(message as TemplateStringsArray, ...args);
      }

      return emit({ level: LogLevel.debug, message });
    },

    verbose(message: string | TemplateStringsArray, ...args: QuickConst[]) {
      if (isTmplStringArray(message)) {
        message = qstr(message as TemplateStringsArray, ...args);
      }

      return emit({ level: LogLevel.verbose, message });
    },

    info(message: string | TemplateStringsArray, ...args: QuickConst[]) {
      if (isTmplStringArray(message)) {
        message = qstr(message as TemplateStringsArray, ...args);
      }

      return emit({ level: LogLevel.info, message });
    },

    warning(...args: [message: string, error?: Error | undefined] | [strings: TemplateStringsArray, ...QuickConst[]]) {
      if (isTmplStringArray(args[0])) {
        const [strings, ...rest] = args;

        return emit({ level: LogLevel.warning, message: qstr(strings, ...(rest as QuickConst[])) });
      } else {
        const [message, error] = args;

        return emit({ level: LogLevel.warning, message, error: error as Error });
      }
    },

    error(...args: [message: string, error?: Error | undefined] | [strings: TemplateStringsArray, ...QuickConst[]]) {
      if (isTmplStringArray(args[0])) {
        const [strings, ...rest] = args;

        return emit({ level: LogLevel.error, message: qstr(strings, ...(rest as QuickConst[])) });
      } else {
        const [message, error] = args;

        return emit({ level: LogLevel.error, message, error: error as Error });
      }
    },
  });
}
