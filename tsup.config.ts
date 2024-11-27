import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts', 'src/scripts/background-reload.ts', 'src/scripts/sidepanel-reload.ts'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: true,
  format: ['cjs', 'esm']
});
