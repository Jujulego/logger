import { qprop } from '@jujulego/quick-tag';
import chalkGlobal, { ChalkInstance, chalkStderr, ColorName } from 'chalk';
import { makeTaggedTemplate } from 'chalk-template';

import { LogLabel, LogTimestamp } from '../attributes/index.js';
import { Log, LogFormat, LogLevel, LogTransport } from '../defs/index.js';
import { quick } from '../quick.js';

// Types
export type StreamLog = Log & Partial<LogLabel & LogTimestamp>;
export type StreamColors = Partial<Record<LogLevel, ColorName>>;

export interface StreamOptions<L extends Log = Log> {
  chalk?: ChalkInstance;
  format?: LogFormat<L>;
  colors?: StreamColors;
}

// Format
export const streamFormat = (chalk = chalkGlobal) => quick.wrap(makeTaggedTemplate(chalk))
  .function<StreamLog>`#?:${qprop('timestamp')}{grey #$ - }?#${qprop('label')} - #?:${qprop('label')}[#$] ?#${qprop('message')}`;

export const streamColors: StreamColors = {
  [LogLevel.debug]: 'grey',
  [LogLevel.verbose]: 'blue',
  [LogLevel.warning]: 'yellow',
  [LogLevel.error]: 'red',
};

// Builder
export function toStream(stream: NodeJS.WritableStream): LogTransport<StreamLog>;
export function toStream<L extends Log>(stream: NodeJS.WritableStream, opts?: StreamOptions<L>): LogTransport<L>;

export function toStream(stream: NodeJS.WritableStream, opts: StreamOptions = {}): LogTransport<Log> {
  // Parse options
  const chalk = opts.chalk ?? chalkGlobal;
  const colors = opts.colors ?? streamColors;
  const format = opts.format ?? streamFormat(chalk);

  // Build transport
  return {
    next(log) {
      let message = format(log);

      if (log.error) {
        message = `${message}\n${log.error.name}: ${log.error.message}\n${log.error.stack}`;
      }

      if (log.level in colors) {
        message = chalk[colors[log.level]!](message);
      }

      stream.write(message);
    }
  };
}

// Alias
export function toStdout<L extends Log = Log>(opts?: StreamOptions<L>): LogTransport<L> {
  return toStream(process.stdout, opts);
}

export function toStderr<L extends Log = Log>(opts: StreamOptions<L> = {}): LogTransport<L> {
  opts.chalk ??= chalkStderr;
  return toStream(process.stderr, opts);
}
