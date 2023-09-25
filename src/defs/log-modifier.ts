import { Log } from './log.js';

// Types
export type LogModifier<A extends Log = Log, B extends Log = A> = (arg: A) => B;
