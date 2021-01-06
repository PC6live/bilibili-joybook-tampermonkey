import { merge } from "webpack-merge";
import common, { headers, resolve } from "./webpack.common";
import { Configuration } from "webpack";
import WebpackUserscript from "webpack-userscript";

const config = merge<Configuration>(common, {
	mode: "development",
	plugins: [
		new WebpackUserscript({
			metajs: false,
			pretty: true,
			headers: {
				...headers,
				name: "bilibili-joybook-dev",
			},
			proxyScript: {
				baseUrl: resolve("../dist"),
				enable: true,
			},
		}),
	],
});

export default config;
