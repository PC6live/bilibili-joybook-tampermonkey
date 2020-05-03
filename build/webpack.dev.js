const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPluugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		hot: true,
		compress: true,
		port: 8080,
	},
	plugins: [new HtmlWebpackPluugin()],
});
