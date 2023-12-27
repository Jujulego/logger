import { Log, LogFormat } from '../defs/index.js';

export function jsonFormat<L extends Log>(): LogFormat<L> {
  return (log: L) => JSON.stringify(log);
}