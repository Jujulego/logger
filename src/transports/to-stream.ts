import { qprop } from '@jujulego/quick-tag';
import chalkGlobal, { chalkStderr, ColorName } from 'chalk';
import { makeTaggedTemplate } from 'chalk-template';
import os from 'node:os';

import { LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogTransport } from '../defs/index.js';
import { qlevelColor } from '../formats/index.js';
import { qlogLevel, quick } from '../quick.js';

// Types
export type StreamLog = Log & Partial<LogLabel & LogTimestamp>;
export type StreamColors = Partial<Record<LogLevel, ColorName>>;

// Format
export const streamFormat = (chalk = chalkGlobal) => qlevelColor(
  quick.wrap(makeTaggedTemplate(chalk))
    .function<StreamLog>`#?:${qprop('timestamp')}{grey #$ - }?#${qlogLevel()} - #?:${qprop('label')}[#$] ?#${qprop('message')}#?:${qprop('error')}${os.EOL}#!error$?#`,
  { chalk }
);

export const streamColors: StreamColors = {
  [LogLevel.debug]: 'grey',
  [LogLevel.verbose]: 'blue',
  [LogLevel.warning]: 'yellow',
  [LogLevel.error]: 'red',
};

// Builder
export function toStream(stream: NodeJS.WritableStream): LogTransport<StreamLog>;
export function toStream<L extends Log>(stream: NodeJS.WritableStream, format?: LogFormat<L>): LogTransport<L>;

export function toStream(stream: NodeJS.WritableStream, format: LogFormat = streamFormat()): LogTransport<Log> {
  // Build transport
  return {
    next(log) {
      stream.write(format(log) + os.EOL);
    }
  };
}

// Alias
export function toStdout<L extends Log = Log>(format?: LogFormat<L>): LogTransport<L> {
  return toStream(process.stdout, format);
}

export function toStderr<L extends Log = Log>(format: LogFormat<L> = streamFormat(chalkStderr)): LogTransport<L> {
  return toStream(process.stderr, format);
}
