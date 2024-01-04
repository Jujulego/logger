import { Log, LogFormat } from '../defs/index.js';

export function jsonFormat<L extends Log>(): LogFormat<L> {
  return (log: L) => {
    const marks = new Set<unknown>();
    
    return JSON.stringify(log, (key, value) => {
      if (typeof value === 'object') {
        if (marks.has(value)) {
          return '[Circular]';
        }

        marks.add(value);
      }
      
      if (value instanceof Error) {
        const error: Record<string, unknown> = {};
  
        for (const propName of Object.getOwnPropertyNames(value) as (keyof Error)[]) {
          Object.assign(error, { [propName]: value[propName] });
        }
  
        return error;
      }
  
      return value;
    });
  };
}
