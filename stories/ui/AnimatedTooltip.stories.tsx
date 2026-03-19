import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const samplePeople = [
  { id: 1, name: "John Doe", designation: "Software Engineer", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" },
  { id: 2, name: "Robert Johnson", designation: "Product Manager", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" },
  { id: 3, name: "Jane Smith", designation: "Data Scientist", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { id: 4, name: "Emily Davis", designation: "UX Designer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
  { id: 5, name: "Tyler Durden", designation: "Soap Developer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
];

const meta: Meta<typeof AnimatedTooltip> = {
  title: "UI/AnimatedTooltip",
  component: AnimatedTooltip,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    layout: "centered",
  },
  args: {
    items: samplePeople,
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedTooltip>;

export const Default: Story = {};

export const FewItems: Story = {
  args: {
    items: samplePeople.slice(0, 3),
  },
};
