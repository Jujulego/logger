import { Log, LogModifier } from '../defs/index.js';

// Types
export type InjectTimestamp<L extends Log> = L & { timestamp: string };
export type InjectTimestampModifier<L extends Log> = LogModifier<L, InjectTimestamp<L>>;

// Utils
export function hasTimestamp<L extends Log>(log: L): log is InjectTimestamp<L> {
  return 'timestamp' in log;
}

// Modifier
/**
 * Injects current timestamp in log record
 */
export function injectTimestamp<L extends Log>(): InjectTimestampModifier<L> {
  return (log: L) => hasTimestamp(log) ? log : Object.assign(log, { timestamp: new Date().toISOString() });
}