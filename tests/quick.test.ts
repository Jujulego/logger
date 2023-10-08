import path from 'node:path';

import { quick } from '@/src/quick.js';

// Tests
describe('#!cwd:', () => {
  it('should return relative path to current working directory (cwd)', () => {
    const absolute = path.join(process.cwd(), 'test/life/42');

    expect(quick.string`#!cwd:${absolute}`).toBe(`test${path.sep}life${path.sep}42`);
  });

  it('should print value if not a string', () => {
    expect(quick.string`#!cwd:${42}`).toBe('42');
  });
});
