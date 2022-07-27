import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { rollup } from "rollup";
console.log(process.env.NODE_ENV);

const config = {
  input: "./index.ts",
  output: [
    {
      format: "cjs",
      file: "./lib/index.js",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
    sourceMaps(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
if (process.env.NODE_ENV === "production") {
  config.plugins.push(terser());
}
//export default rollup(config).then((da) => da);
export default config;
