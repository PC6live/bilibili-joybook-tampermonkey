import { merge } from "webpack-merge";
import common, { headers, resolve, TENV } from "./webpack.common";
import { Configuration } from "webpack";
import WebpackUserscript from "webpack-userscript";

const config = (env: TENV) => merge<Configuration>(common(env), {
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
				baseUrl: `file:${resolve("../dist")}`,
				enable: true,
			},
		}),
	],
});

export default config;
