import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    backgrounds: { default: "grooveshelf" },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p className="text-foreground">Simple card with content only.</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Album Info</CardTitle>
        <CardDescription>Details about your vinyl record.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">
          This card shows album metadata like artist, year, and condition.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Add to Collection</CardTitle>
        <CardDescription>Enter the details of your new vinyl.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">
          Fill in the album name, artist, and year to add it to your shelf.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default">Save</Button>
      </CardFooter>
    </Card>
  ),
};
