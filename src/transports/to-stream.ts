import { q$, qarg, qerror, qprop, qwrap } from '@jujulego/quick-tag';
import chalkGlobal, { chalkStderr, ColorName } from 'chalk';
import { makeTaggedTemplate } from 'chalk-template';
import os from 'node:os';

import { LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogReceiver } from '../defs/index.js';
import { qLevelColor, qLogLevel } from '../formats/index.js';

// Types
export type StreamLog = Log & Partial<LogTimestamp>;
export type StreamColors = Partial<Record<LogLevel, ColorName>>;

// Format
export const streamFormat = (chalk = chalkGlobal) => qLevelColor(
  qwrap(makeTaggedTemplate(chalk))
    .fun`#?:${qprop('timestamp')}{grey ${q$} - }?#${qLogLevel(qarg<StreamLog>())} - #?:${qprop('label')}[${q$}] ?#${qprop('message')}#?:${qerror(qprop<StreamLog>('error'))}${os.EOL}${q$}?#`,
  { chalk }
);

export const streamColors: StreamColors = {
  [LogLevel.debug]: 'grey',
  [LogLevel.verbose]: 'blue',
  [LogLevel.warning]: 'yellow',
  [LogLevel.error]: 'red',
};

// Builder
export function toStream(stream: NodeJS.WritableStream): LogReceiver<StreamLog>;
export function toStream<L extends Log>(stream: NodeJS.WritableStream, format?: LogFormat<L>): LogReceiver<L>;

export function toStream(stream: NodeJS.WritableStream, format: LogFormat = streamFormat()): LogReceiver<Log> {
  // Build transport
  return {
    next(log) {
      stream.write(format(log) + os.EOL);
    }
  };
}

// Alias
export function toStdout<L extends Log = Log>(format?: LogFormat<L>): LogReceiver<L> {
  return toStream(process.stdout, format);
}

export function toStderr<L extends Log = Log>(format: LogFormat<L> = streamFormat(chalkStderr)): LogReceiver<L> {
  return toStream(process.stderr, format);
}
