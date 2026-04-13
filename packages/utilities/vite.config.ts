import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json" with { type: "json" };

const external = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];

export default defineConfig({
    plugins: [dts({ tsconfigPath: "./tsconfig.json", outDir: "dist", exclude: ["**/*.test.ts", "**/*.spec.ts"] })],
    build: {
        sourcemap: true,
        minify: false,
        emptyOutDir: false,
        lib: {
            entry: "src/index.ts",
        },
        rollupOptions: {
            external,
            output: [
                {
                    format: "es",
                    dir: "lib",
                    preserveModules: true,
                    preserveModulesRoot: "src",
                    entryFileNames: "[name].js",
                },
                {
                    format: "cjs",
                    dir: "lib-commonjs",
                    preserveModules: true,
                    preserveModulesRoot: "src",
                    entryFileNames: "[name].js",
                },
            ],
        },
    },
});
