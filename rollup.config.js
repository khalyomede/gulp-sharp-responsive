import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.ts",
	plugins: [
		typescript(),
	],
	output: {
		file: "lib/index.js",
		format: "cjs",
		exports: "default",
	},
	external: [
		"through2",
		"plugin-error",
		"sharp",
		"rename",
		"fancy-log",
		"vinyl",
		"path",
		"image-size",
	],
};
