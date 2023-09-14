import { LogLevel } from './log-levels.js';

// Interface
export interface Log {
  level: LogLevel;
  message: string;
}