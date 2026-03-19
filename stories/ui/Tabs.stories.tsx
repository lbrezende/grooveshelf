"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="collection" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="collection">Collection</TabsTrigger>
        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      <TabsContent value="collection">
        <p className="text-sm text-foreground p-4">
          Your vinyl collection appears here.
        </p>
      </TabsContent>
      <TabsContent value="wishlist">
        <p className="text-sm text-foreground p-4">
          Albums you want to add to your shelf.
        </p>
      </TabsContent>
      <TabsContent value="stats">
        <p className="text-sm text-foreground p-4">
          Collection statistics and insights.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
