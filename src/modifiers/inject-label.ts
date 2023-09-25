import { Log, LogModifier } from '../defs/index.js';

// Types
export type InjectLabel<L extends Log> = L & { label: string };
export type InjectLabelModifier<L extends Log> = LogModifier<L, InjectLabel<L>>;

// Utils
export function hasLabel<L extends Log>(log: L): log is InjectLabel<L> {
  return 'label' in log;
}

// Modifier
/**
 * Injects given label in log record
 *
 * @param label Label to inject
 * @param force If false label won't be injected if log already has one
 */
export function injectLabel<L extends Log>(label: string, force = false): InjectLabelModifier<L> {
  return (log: L) => !force && hasLabel(log) ? log : Object.assign(log, { label });
}
