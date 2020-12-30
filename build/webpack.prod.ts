import { merge } from "webpack-merge";
import common, { headers } from "./webpack.common";
import { Configuration } from "webpack";
import WebpackUserscript from "webpack-userscript";

const config = merge<Configuration>(common, {
	mode: "production",
	devtool: "source-map",
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
