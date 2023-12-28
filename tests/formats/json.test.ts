import { beforeEach, describe, expect, it } from 'vitest';

import { LogFormat, LogLevel } from '@/src/defs/index.js';
import { jsonFormat } from '@/src/formats/json.js';

// Setup
let format: LogFormat;

beforeEach(() => {
  format = jsonFormat();
});

// Test
describe('jsonFormat', () => {
  it('should format object as one line json', () => {
    expect(format({ level: LogLevel.info,  message: 'test' }))
      .toMatchInlineSnapshot('"{"level":2,"message":"test"}"');
  });

  it('should format object containing error as one line json', () => {
    const error = new Error('Test');
    Object.assign(error, { stack: 'test stack' });

    expect(format({ level: LogLevel.error,  message: 'test', error }))
      .toMatchInlineSnapshot('"{"level":4,"message":"test","error":{"stack":"test stack","message":"Test"}}"');
  });
});