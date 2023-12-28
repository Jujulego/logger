import { beforeEach, describe, expect, Mock, vi } from 'vitest';
import { Source, source$ } from 'kyrielle';
import { pipe$ } from 'kyrielle/operators';
import process from 'node:process';

import { LogLabel } from '@/src/attributes/label.js';
import { Log, LogLevel } from '@/src/defs/index.js';
import { debugFilter } from '@/src/filters/debug.js';

// Setup
let logger: Source<Log & Partial<LogLabel>>;

beforeEach(() => {
  logger = source$();
});

// Tests
describe('debugFilter', () => {
  describe('empty DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      pipe$(logger, debugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, debugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should filter labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('wildcard DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      process.env.DEBUG = '*';
      pipe$(logger, debugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, debugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('list DEBUG', () => {
    let spy: Mock;

    beforeEach(() => {
      spy = vi.fn();

      process.env.DEBUG = 'toto,tata,tutu';
      pipe$(logger, debugFilter())
        .subscribe(spy);
    });

    it('should not filter labelled info logs', () => {
      const spy = vi.fn();

      pipe$(logger, debugFilter())
        .subscribe(spy);

      logger.next({ label: 'test', level: LogLevel.info, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should not filter unlabelled debug logs', () => {
      logger.next({ level: LogLevel.info, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should filter some labelled debug logs', () => {
      logger.next({ label: 'test', level: LogLevel.debug, message: 'Test' });
      logger.next({ label: 'tata', level: LogLevel.debug, message: 'Test' });

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});