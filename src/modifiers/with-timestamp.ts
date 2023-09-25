import { Log, LogModifier } from '../defs/index.js';

// Types
export type WithTimestamp<L extends Log> = L & { timestamp: string };
export type WithTimestampModifier<L extends Log> = LogModifier<L, WithTimestamp<L>>;

// Utils
export function hasTimestamp<L extends Log>(log: L): log is WithTimestamp<L> {
  return 'timestamp' in log;
}

// Modifier
/**
 * Injects current timestamp in log record
 */
export function withTimestamp<L extends Log>(): WithTimestampModifier<L> {
  return (log: L) => hasTimestamp(log) ? log : Object.assign(log, { timestamp: new Date().toISOString() });
}