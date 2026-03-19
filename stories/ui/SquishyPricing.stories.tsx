import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SquishyPricing } from "@/components/ui/squishy-pricing";

const meta: Meta<typeof SquishyPricing> = {
  title: "UI/SquishyPricing",
  component: SquishyPricing,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SquishyPricing>;

export const Default: Story = {};
