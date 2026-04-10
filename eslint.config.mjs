import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default defineConfig(
    // Global ignores
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/lib/**", "**/lib-commonjs/**", "**/bin/**"],
    },

    // Base ESLint recommended
    js.configs.recommended,

    // Airbnb + legacy plugin configs via compat (single call to avoid plugin redefinition)
    ...fixupConfigRules(
        compat.extends("airbnb", "airbnb/hooks", "plugin:import/typescript", "plugin:react/jsx-runtime", "plugin:storybook/recommended"),
    ),

    // TypeScript ESLint type-checked + stylistic (native flat config)
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    // All TypeScript source files
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        settings: {
            "jsx-a11y": { polymorphicPropName: "as" },
            react: { version: "detect" },
        },
        rules: {
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-use-before-define": "off",
            "import/extensions": "off",
            "import/prefer-default-export": "off",
            "no-console": "error",
            "no-debugger": "error",
            "no-invalid-regexp": "error",
            "no-param-reassign": "error",
            "no-use-before-define": "off",
            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",
            "react/jsx-no-constructed-context-values": "off",
            "react/jsx-no-useless-fragment": "off",
            "react/jsx-props-no-spreading": "off",
            "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
            "react/require-default-props": "off",
        },
    },

    // Test file overrides
    {
        files: ["**/*.test.ts", "**/*.test.tsx", "__mocks__/**/*"],
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            "import/no-extraneous-dependencies": "off",
        },
    },

    // Prettier must be last to override formatting rules
    prettier,
);
