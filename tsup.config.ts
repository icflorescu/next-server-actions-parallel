import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entryPoints: ['./src/index.ts'],
  tsconfig: './tsup.tsconfig.json',
  format: ['cjs', 'esm'],
  minify: true,
  dts: true,
});
