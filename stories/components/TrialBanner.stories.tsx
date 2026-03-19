import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrialBanner } from "@/components/paywall/trial-banner";

const meta: Meta<typeof TrialBanner> = {
  title: "Components/TrialBanner",
  component: TrialBanner,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    nextjs: { appDirectory: true },
  },
  argTypes: {
    daysLeft: {
      control: { type: "number", min: 1, max: 30 },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TrialBanner>;

export const FourteenDays: Story = {
  args: { daysLeft: 14 },
};

export const SevenDays: Story = {
  args: { daysLeft: 7 },
};

export const ThreeDays: Story = {
  args: { daysLeft: 3 },
};

export const LastDay: Story = {
  args: { daysLeft: 1 },
};
