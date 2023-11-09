import { defineConfig } from "rollup";
import { header, convertToString } from "./src/banner";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import scss from "rollup-plugin-scss";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json" assert { type: "json" };

header.version = pkg.version

const config = defineConfig({
	input: "src/index.ts",
	output: {
		banner: convertToString(header),
		file: pkg.main,
		format: "iife",
		sourcemap: true,
		inlineDynamicImports: true,
	},
	plugins: [
		alias({
			entries: [{ find: "src", replacement: "src" }],
		}),

		postcss(),
		scss(),

		json(),
		typescript(),
	],
});

export default config;
