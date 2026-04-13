import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    stories: ["../**/*.mdx", "../**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-docs", "@storybook/addon-mcp"],
    core: {
        builder: "@storybook/builder-vite",
    },
};

export default config;
