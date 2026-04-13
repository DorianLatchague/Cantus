import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            toc: {
                headingSelector: "h2, h3",
                ignoreSelector: ".docs-story *, .skip-toc, .sbdocs-subtitle",
            },
        },
    },
};

export default preview;
