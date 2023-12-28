import { Log, LogFormat } from '../defs/index.js';

export function jsonFormat<L extends Log>(): LogFormat<L> {
  return (log: L) => JSON.stringify(log, (key, value) => {
    if (value instanceof Error) {
      const error: Record<string, unknown> = {};

      for (const propName of Object.getOwnPropertyNames(value) as (keyof Error)[]) {
        Object.assign(error, { [propName]: value[propName] });
      }

      return error;
    }

    return value;
  });
}