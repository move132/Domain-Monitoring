import {defineConfig} from 'tsup'

export default defineConfig({
	dts: true,
	clean: true,
	minify: false,
	splitting: true,
	outDir: 'dist',
	format: ['cjs', 'esm'],
	globalName: 'denseLabs',
	entry: ['src/index.ts'],
	noExternal: ['slash']
})
