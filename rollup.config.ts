import { defineConfig } from "rollup";
import { banner } from "./src/banner";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import scss from "rollup-plugin-scss";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

const config = defineConfig({
	input: "src/index.ts",
	output: {
		banner,
		file: pkg.main,
		format: "iife",
		sourcemap: true,
		inlineDynamicImports: true,
	},
	plugins: [
    alias({
			entries: [{ find: "src", replacement: "src" }],
		}),
		replace({
			preventAssignment: true,
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),

    postcss(),
		scss(),

    json(),
		typescript(),
	],
})

export default config;
