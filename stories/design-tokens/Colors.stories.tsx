import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokens } from "@/design-system/tokens";
import { tokenKeyToCssVar } from "@/design-system/utils";

const colors = Object.entries(tokens.colors).map(([key, hex]) => ({
  name: key,
  var: tokenKeyToCssVar(key),
  hex,
}));

function ColorSwatches() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
      {colors.map((color) => (
        <div
          key={color.name}
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${tokens.colors.border}`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "80px",
              backgroundColor: color.hex,
              border: color.hex === tokens.colors.background ? `1px solid ${tokens.colors.border}` : "none",
            }}
          />
          <div style={{ padding: "8px 12px", backgroundColor: tokens.colors.card }}>
            <div style={{ color: tokens.colors.foreground, fontWeight: 600, fontSize: "13px" }}>
              {color.name}
            </div>
            <div style={{ color: tokens.colors.mutedForeground, fontSize: "11px", fontFamily: "monospace" }}>
              {color.var}
            </div>
            <div style={{ color: tokens.colors.mutedForeground, fontSize: "11px", fontFamily: "monospace" }}>
              {color.hex}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Colors",
  component: ColorSwatches,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj;

export const AllColors: Story = {};
