import { Quick, QuickArg, QuickJsonCommand } from '@jujulego/quick-tag';
import path from 'node:path';

import { Log, LogLevel } from './defs/index.js';

// Logger quick instance
export const quick = new Quick();

// Commands
quick.register(QuickJsonCommand);

quick.register({
  name: 'cwd',
  format(val) {
    if (typeof val === 'string') {
      return path.relative(process.cwd(), val);
    }

    return val?.toString() ?? '';
  }
});

quick.register({
  name: 'error',
  format(err) {
    if (err && typeof err === 'object' && 'stack' in err && typeof err.stack === 'string') {
      return err.stack;
    }

    return err?.toString() ?? '';
  }
});

// Utils
export function qlogLevel(fixLength = true): QuickArg<Log> {
  return (log: Log) => {
    let level = LogLevel[log.level];

    if (fixLength && level.length < 7) {
      level += ' '.repeat(7 - level.length);
    }

    return level;
  };
}
