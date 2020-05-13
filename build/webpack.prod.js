const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');

const message = `
// ==UserScript==
// @name         bilibili-joybook
// @version      0.0.2
// @description  共享大会员
// @author       PC6live
// @license      MIT
// @include      *://*.bilibili.com/*
// @exclude      *://passport.bilibili.com/*
// @homepage     https://github.com/PC6live/joybook-tampermonkey
// @supportURL   https://github.com/PC6live/joybook-tampermonkey/issues
// @grant        GM_cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// ==/UserScript==
`;

module.exports = (env) => {
	return merge(common(env), {
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
};
