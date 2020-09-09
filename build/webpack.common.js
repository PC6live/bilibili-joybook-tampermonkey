const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const resolve = (str) => {
	return path.resolve(__dirname, str);
};

module.exports = () => {
	return {
		entry: resolve("../src/index.ts"),
		output: {
			path: resolve("../dist"),
			filename: "joybook.user.js",
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: "babel-loader",
					exclude: /node_modules/,
				},
				{
					test: /\.ts(x)?$/,
					loader: "ts-loader",
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"],
					exclude: /\.module\.css$/,
				},
				{
					test: /\.css$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
								modules: true,
							},
						},
					],
					include: /\.module\.css$/,
				},
				{
					test: /\.s(a|c)ss$/,
					use: ["style-loader", "css-loader", "sass-loader"],
					exclude: /\.module\.s(a|c)ss$/,
				},
				{
					test: /\.s(a|c)ss$/,
					use: ["style-loader", "css-loader", "sass-loader"],
					include: /\.module\.s(a|c)ss$/,
				},
			],
		},
		resolve: {
			alias: {
				"@": resolve("../src"),
			},
			extensions: [".tsx", ".ts", ".js"],
		},
		plugins: [new CleanWebpackPlugin()],
	};
};
