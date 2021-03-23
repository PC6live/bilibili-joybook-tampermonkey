import { merge } from "webpack-merge";
import common, { headers, TENV } from "./webpack.common";
import { Configuration } from "webpack";
import WebpackUserscript from "webpack-userscript";

const config = (env: TENV) => merge<Configuration>(common(env), {
	mode: "production",
	plugins: [
		new WebpackUserscript({
			metajs: false,
			pretty: true,
			headers,
		}),
	],
});

export default config;
