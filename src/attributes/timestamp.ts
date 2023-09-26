import { Log, LogFormatStep, LogModifier } from '../defs/index.js';

// Types
export interface LogTimestamp {
  timestamp: string;
}

export type WithTimestamp<L extends Log = Log> = L & LogTimestamp;
export type WithTimestampModifier<L extends Log> = LogModifier<L, WithTimestamp<L>>;

export type TimestampFormatter = (label: string) => string;

// Utils
export function hasTimestamp<L extends Log>(log: L): log is WithTimestamp<L> {
  return 'timestamp' in log;
}

// Modifier
/**
 * Injects current timestamp in log record
 */
export function withTimestamp<L extends Log>(): WithTimestampModifier<L> {
  return (log: L) => ({ timestamp: new Date().toISOString(), ...log });
}

// Formatter
/**
 * Prepend message by "$timestamp -"
 *
 * @param fmt callback to customize label format
 */
export function formatTimestamp(
  fmt: TimestampFormatter = (timestamp) => `${timestamp} -`
): LogFormatStep<Log & Partial<LogTimestamp>> {
  return (log, text) => hasTimestamp(log) ? `${fmt(log.timestamp)} ${text}` : text;
}
