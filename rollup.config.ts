import { defineConfig } from "rollup";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import scss from "rollup-plugin-scss";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";
import { banner } from "./src/banner";

const config = defineConfig({
	input: "src/index.ts",
	output: {
		banner,
		file: pkg.main,
		format: "iife",
		sourcemap: "hidden",
		inlineDynamicImports: true,
	},
	plugins: [
		typescript(),
		postcss(),
		scss(),
		alias({
			entries: [{ find: "@", replacement: "src" }],
		}),
		replace({
			preventAssignment: true,
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		}),
	],
})

export default config;
