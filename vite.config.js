import path from 'path'

export default {
	publicDir: 'static/',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	server:
	{
		host: true,
		open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
	},
	build:
	{
		base: './',
		outDir: './dist', // Output in the dist/ folder
		emptyOutDir: true, // Empty the folder first
		sourcemap: false, // Add sourcemap
		minify: 'esbuild',
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	},
}