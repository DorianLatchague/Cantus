import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
    title: "Utilities/Object",
    tags: ["!dev"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Patch: Story = {
    argTypes: {
        originalObject: {
            description: "The object to clone and patch.",
            table: { type: { summary: "T" } },
        },
        patches: {
            name: "...patches",
            description:
                "One or more partial updates. Can be objects or functions that receive the current state and return a partial.",
            table: {
                type: {
                    summary: "(DeepPartial<T> | ((obj: T) => DeepPartial<T>))[]",
                },
            },
        },
    },
};

export const DotNestedKeyofType: Story = {
    argTypes: {
        T: {
            description: "The object type to extract key paths from.",
        },
        D: {
            description:
                'Maximum nesting depth. Lower this if you encounter "Type instantiation is excessively deep" errors.',
            table: { defaultValue: { summary: "5" } },
        },
    },
};

export const DotNestedKeyofValueType: Story = {
    argTypes: {
        T: {
            description: "The object type to extract key paths from.",
        },
        V: {
            description: "The value type to filter key paths by.",
        },
    },
};
