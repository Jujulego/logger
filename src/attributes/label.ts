import { Log, LogFormatStep, LogModifier } from '../defs/index.js';

// Types
export interface LogLabel {
  label: string;
}

export type WithLabel<L extends Log = Log> = L & LogLabel;
export type WithLabelModifier<L extends Log> = LogModifier<L, WithLabel<L>>;

export type LabelFormatter = (label: string) => string;

// Utils
export function hasLabel<L extends Log>(log: L): log is WithLabel<L> {
  return 'label' in log;
}

// Modifier
/**
 * Injects given label in log record
 *
 * @param label Label to inject
 * @param force If false label won't be injected if log already has one
 */
export function withLabel<L extends Log>(label: string, force = false): WithLabelModifier<L> {
  return (log: L) => force ? { ...log, label } : { label, ...log };
}

// Formatter
/**
 * Prepend message by squared "[$label] "
 *
 * @param fmt callback to customize label format
 */
export function formatLabel(
  fmt: LabelFormatter = (label) => `[${label}]`
): LogFormatStep<Log & Partial<LogLabel>> {
  return (log, text) => hasLabel(log) ? `${fmt(log.label)} ${text}` : text;
}
