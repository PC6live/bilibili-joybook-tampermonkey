const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	mode: 'production',
	// devtool: 'source-map',
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
});
