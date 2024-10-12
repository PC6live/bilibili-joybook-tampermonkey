import { resolve } from "path";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json";

export default defineConfig({
	resolve: {
		alias: {
			src: resolve(__dirname, "./src"),
		},
	},
	plugins: [
		monkey({
			entry: "src/main.ts",
			build: {
				fileName: "joybook.user.js",
			},
			userscript: {
				version: pkg.version,
				name: "bilibili-joybook",
				description: "共享大会员",
				author: "PC6live",
				namespace: "https://github.com/PC6live/bilibili-joybook-tampermonkey",
				match: "*://*.bilibili.com/*",
				exclude: "*://passport.bilibili.com/*",
				homepage: "https://github.com/PC6live/bilibili-joybook-tampermonkey",
				supportURL:
					"https://github.com/PC6live/bilibili-joybook-tampermonkey/issues",
				license: "MIT",
				"run-at": "document-start",
				noframes: true,
				connect: "bilibili.com",
			},
		}),
	],
});
