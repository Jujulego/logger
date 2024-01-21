import { QuickFun } from '@jujulego/quick-tag';
import chalkGlobal, { ChalkInstance, ColorName } from 'chalk';

import { Log, LogLevel } from '../defs/index.js';

// Types
export type QLevelColor = Partial<Record<LogLevel, ColorName>>;

export interface QLevelColorOpts {
  chalk?: ChalkInstance;
  colors?: QLevelColor;
}

// Utils
export function qLevelColor<L extends Log = Log>(fun: QuickFun<L>, opts: QLevelColorOpts = {}): QuickFun<L> {
  // Parse options
  const chalk = opts.chalk ?? chalkGlobal;
  const colors = opts.colors ?? {
    [LogLevel.debug]: 'grey',
    [LogLevel.verbose]: 'blue',
    [LogLevel.warning]: 'yellow',
    [LogLevel.error]: 'red',
  };

  // Formatter
  function addColor(log: L, str: string): string {
    const color = colors[log.level];

    if (color) {
      return chalk[color](str);
    }

    return str;
  }

  // Wrap
  return (log: L) => addColor(log, fun(log));
}
