import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: "320px" }}>
      <Input placeholder="Search your collection..." />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ maxWidth: "320px", display: "flex", flexDirection: "column", gap: "6px" }}>
      <Label htmlFor="album">Album Name</Label>
      <Input id="album" placeholder="Enter album name" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: "320px" }}>
      <Input placeholder="Disabled input" disabled />
    </div>
  ),
};
