import { PipeOperator } from '@jujulego/aegis';
import { Observable, source$ } from '@jujulego/event-tree';

import { Log, LogFormatStep } from './defs/index.js';

// Formatter
export function logFormat<L extends Log>(...fns: LogFormatStep<L>[]) {
  return (log: L, text = log.message) => fns.reduce((msg, fn) => fn(log, msg), text);
}

// Pipe
export function logFormat$<L extends Log>(...fns: LogFormatStep<L>[]): PipeOperator<Observable<L>, Observable<string>> {
  const format = logFormat(...fns);

  return (obs, { off })=>{
    const out = source$<string>();
    off.add(obs.subscribe(format));

    return out;
  };
}
