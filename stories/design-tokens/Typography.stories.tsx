import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokens } from "@/design-system/tokens";

const sampleText: Record<string, string> = {
  "Heading 1": "Heading 1",
  "Heading 2": "Heading 2",
  "Heading 3": "Heading 3",
  "Heading 4": "Heading 4",
  Body: "Body text. The quick brown fox jumps over the lazy dog.",
  Small: "Small text. Used for secondary information and captions.",
  Muted: "Muted text. Used for helper text and less important information.",
};

function TypographyScale() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {tokens.typography.scale.map((entry) => (
        <div key={entry.name}>
          <span
            style={{
              color: tokens.colors.mutedForeground,
              fontSize: "12px",
              fontFamily: "monospace",
              display: "block",
              marginBottom: "4px",
            }}
          >
            {entry.tag} &mdash; {entry.classes}
          </span>
          {(() => {
            const Tag = entry.tag as keyof React.JSX.IntrinsicElements;
            return (
              <Tag className={`${entry.classes} text-foreground`}>
                {sampleText[entry.name] ?? entry.name}
              </Tag>
            );
          })()}
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Typography",
  component: TypographyScale,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj;

export const FontScale: Story = {};
