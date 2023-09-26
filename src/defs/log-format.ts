import { Log } from './log.js';

// Types
export type LogFormat<L extends Log = Log> = (log: L) => string;
export type LogFormatStep<L extends Log = Log> = (log: L, text: string) => string;
