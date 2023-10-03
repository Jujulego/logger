import { Quick, QuickArg } from '@jujulego/quick-tag';

import { Log, LogLevel } from './defs/index.js';

// Logger quick instance
export const quick = new Quick();

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