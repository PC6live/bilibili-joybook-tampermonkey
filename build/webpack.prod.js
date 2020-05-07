const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

const message = `
// ==UserScript==
// @name         bilibili-joybook
// @version      0.0.1
// @description  共享大会员
// @license      MIT
// @include     *://*.bilibili.com/*
// @exclude     *://passport.bilibili.com/*
// @homepage    https://github.com/PC6live/joybook-tampermonkey
// @supportURL  https://github.com/PC6live/joybook-tampermonkey/issues
// @grant       GM_cookie
// @grant       GM.cookie
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       unsafeWindow
// @run-at      document-start
// @noframes
// ==/UserScript==
`

module.exports = merge(common, {
	mode: 'production',
	// devtool: 'source-map',
	optimization: {
		minimize: true,
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: message,
			entryOnly: true,
		}),
	],
});
