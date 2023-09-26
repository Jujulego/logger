import { PipeOperator } from '@jujulego/aegis';
import { Observable, source$ } from '@jujulego/event-tree';

import { Log, LogFormat } from './defs/index.js';

// Types
export interface LogFormatArg<K, V = string> {
  key: K;
  fmt: (val: V) => string;
}

export type LogArg<L extends Log> = { [K in keyof L]: LogFormatArg<K, L[K]> }[keyof L];

// Formatter
export function logFormat<L extends Log>(strings: TemplateStringsArray, ...args: (keyof L | LogArg<L>)[]): LogFormat<L> {
  const parsed = args.map((key) => {
    if (typeof key === 'object') {
      return key;
    } else {
      return {
        key,
        fmt: (v) => '' + v,
      } as LogFormatArg<keyof L, L[keyof L]>;
    }
  });

  // Build formatter
  return (log) => {
    let result = strings[0] ?? '';

    for (let i = 0; i < parsed.length; ++i) {
      let next = strings[i + 1]!;

      const arg = parsed[i]!;
      const val = arg.fmt(log[arg.key]);

      // Search optional black
      const optionalStart = result.match(/#\?([a-z]+):.*?$/i);
      const optionalEnd = next.match(/^.*?\?#/i);

      if (optionalStart && optionalEnd) {
        const key = optionalStart[1]!;

        const resultStartIdx = result.length - optionalStart[0].length;
        const resultEndIdx = resultStartIdx + key.length + 3;

        const nextStartIdx = optionalEnd[0].length - 2;
        const nextEndIdx = nextStartIdx + 2;

        if (log[key as keyof L] === undefined) {
          result = result.slice(0, resultStartIdx);
          next = next.slice(nextEndIdx);
        } else {
          result = result.slice(0, resultStartIdx) + result.slice(resultEndIdx);
          next = next.slice(0, nextStartIdx) + next.slice(nextEndIdx);
        }
      }

      // Add to result
      result += val + next;
    }

    return result;
  };
}

// Utils
export function optional<K>(key: K): LogFormatArg<K, string | undefined>;
export function optional<K, V = string>(key: K, fmt: (val: V) => string): LogFormatArg<K, V | undefined>;
export function optional<K, V = string>(key: K, fmt: (val: V) => string = (v: unknown) => '' + v): LogFormatArg<K, V | undefined> {
  return { key, fmt: (val) => val !== undefined ? fmt(val) : '' };
}

// Pipe
export function logFormat$<L extends Log>(strings: TemplateStringsArray, ...args: (keyof L | LogArg<L>)[]): PipeOperator<Observable<L>, Observable<string>> {
  const format = logFormat(strings, ...args);

  return (obs, { off })=>{
    const out = source$<string>();
    off.add(obs.subscribe(format));

    return out;
  };
}
