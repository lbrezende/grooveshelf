import type { Preview } from "@storybook/nextjs-vite";
import { tokens } from "@/design-system/tokens";
import "./fonts.css";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "grooveshelf",
      values: [
        { name: "grooveshelf", value: tokens.colors.background },
        { name: "card", value: tokens.colors.card },
        { name: "white", value: "#FFFFFF" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
