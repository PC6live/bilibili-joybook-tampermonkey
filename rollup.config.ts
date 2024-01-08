import { defineConfig } from "rollup";
import { header, convertToString } from "./src/banner";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import del from "rollup-plugin-delete";
import pkg from "./package.json" assert { type: "json" };
import path from "path";

header.version = pkg.version;

const config = defineConfig({
	input: path.resolve(__dirname, "./src/index.ts"),
	output: {
		banner: convertToString(header),
		file: path.resolve(__dirname, pkg.main),
		format: "iife",
		sourcemap: true,
		inlineDynamicImports: true,
	},
	plugins: [
		del({ targets: "dist/*" }),
		postcss(),
		json(),
		typescript(),
		alias({
			entries: [{ find: "src", replacement: path.resolve(__dirname, "./src") }],
		}),
		replace({
			values: {
				"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
			},
      preventAssignment: true,
		}),
	],
});

export default config;
