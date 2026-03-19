import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaywallGate } from "@/components/paywall/paywall-gate";

const meta: Meta<typeof PaywallGate> = {
  title: "Components/PaywallGate",
  component: PaywallGate,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    nextjs: { appDirectory: true },
  },
};

export default meta;

type Story = StoryObj<typeof PaywallGate>;

export const Locked: Story = {
  args: {
    hasAccess: false,
    children: "This content is behind the paywall.",
  },
};

export const Unlocked: Story = {
  render: () => (
    <PaywallGate hasAccess={true}>
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">Pro Feature</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This content is visible because the user has access.
        </p>
      </div>
    </PaywallGate>
  ),
};
