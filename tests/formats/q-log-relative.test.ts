import path from 'node:path';

import { qLogRelative } from '@/src/formats/q-log-relative.js';

// Tests
describe('qLogRelative', () => {
  it('should return relative path to current working directory (cwd)', () => {
    const absolute = path.join(process.cwd(), 'test/life/42');

    expect(qLogRelative(absolute)).toBe(`test${path.sep}life${path.sep}42`);
  });
});
