import swc from '@rollup/plugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    cache: { dir: '.vitest' },
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'lcovonly'],
    },
    globals: true,
    typecheck: {
      tsconfig: 'tests/tsconfig.json',
    }
  },
  plugins: [
    tsconfigPaths(),
    (swc as unknown as typeof swc.default)()
  ]
});
