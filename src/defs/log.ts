import { LogLevel } from './log-level.js';

// Interface
export interface Log {
  level: LogLevel;
  message: string;

  error?: Error | undefined;
}
