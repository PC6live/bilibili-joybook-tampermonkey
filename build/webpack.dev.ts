import { merge } from "webpack-merge";
import common, { headers } from "./webpack.common";
import { Configuration } from "webpack";
import WebpackUserscript from "webpack-userscript";
import path from "path";

const config = merge<Configuration>(common, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		port: 9999,
		contentBase: path.join(__dirname, "dist"),
	},
	plugins: [
		new WebpackUserscript({
			headers,
			proxyScript: {
				baseUrl: "http://127.0.0.1:9999",
				filename: "proxy.joybook.user.js",
				enable: true,
			},
		}),
	],
});

export default config;
