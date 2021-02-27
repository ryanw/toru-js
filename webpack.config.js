const path = require('path');
const webpack = require('webpack');

function camelCase(str) {
	return str.toLowerCase().replace(/(^|_)[a-zA-Z]/g, (m) => m.replace('_', '').toUpperCase());
}


const production = (process.env.NODE_ENV === 'production');
const sceneName = process.env.SCENE_NAME || 'retrowave';
const sceneClass = camelCase(sceneName);

module.exports = {
	mode: production ? 'production' : 'development',
	entry: {
		main: './src/index.ts',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devtool: 'source-map',
	devServer: {
		host: '0.0.0.0',
		port: 8088,
		historyApiFallback: true,
	},
	module: {
		rules: [
			// Typescript
			{ test: /\.ts$/, use: 'ts-loader' },

			// Shader files
			{ test: /\.glsl$/, use: ['raw-loader', 'glslify-loader'] },

			// OBJ Mesh files
			{ test: /\.obj$/, use: 'raw-loader' },
		],
	},
	resolve: {
		extensions: [ '.ts', '.js' ],
	},
	plugins: [
		new webpack.DefinePlugin({
			'PRODUCTION': JSON.stringify(production),
			'SCENE_NAME': JSON.stringify(sceneName),
			'SCENE_CLASS': JSON.stringify(sceneClass),
		}),
	],
}
