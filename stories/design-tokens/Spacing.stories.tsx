import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokens } from "@/design-system/tokens";

function SpacingScale() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {tokens.spacing.map((px) => (
        <div key={px} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              width: "48px",
              textAlign: "right",
              color: tokens.colors.mutedForeground,
              fontSize: "13px",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            {px}px
          </span>
          <div
            style={{
              width: `${px}px`,
              height: "24px",
              backgroundColor: tokens.colors.primary,
              borderRadius: "4px",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: tokens.colors.foreground,
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            {px / 4}rem
          </span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Spacing",
  component: SpacingScale,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj;

export const Scale: Story = {};
