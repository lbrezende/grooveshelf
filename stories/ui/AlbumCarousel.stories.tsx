import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlbumCarousel } from "@/components/ui/cases-with-infinite-scroll";

const sampleAlbums = [
  { title: "Un Verano Sin Ti", artist: "Bad Bunny", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72" },
  { title: "Starboy", artist: "The Weeknd", year: 2016, coverUrl: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452" },
  { title: "÷ (Divide)", artist: "Ed Sheeran", year: 2017, coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96" },
  { title: "SOUR", artist: "Olivia Rodrigo", year: 2021, coverUrl: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a" },
  { title: "After Hours", artist: "The Weeknd", year: 2020, coverUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" },
  { title: "Future Nostalgia", artist: "Dua Lipa", year: 2020, coverUrl: "https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd" },
  { title: "SOS", artist: "SZA", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b273bc18bdade69ec5ef0bb25b17" },
  { title: "Midnights", artist: "Taylor Swift", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5" },
  { title: "Purpose", artist: "Justin Bieber", year: 2015, coverUrl: "https://i.scdn.co/image/ab67616d0000b273f46b9d202509a8f7384b90de" },
  { title: "AM", artist: "Arctic Monkeys", year: 2013, coverUrl: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" },
];

const meta: Meta<typeof AlbumCarousel> = {
  title: "UI/AlbumCarousel",
  component: AlbumCarousel,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    layout: "fullscreen",
  },
  args: {
    albums: sampleAlbums,
  },
};

export default meta;
type Story = StoryObj<typeof AlbumCarousel>;

export const Default: Story = {};

export const FewAlbums: Story = {
  args: {
    albums: sampleAlbums.slice(0, 4),
  },
};
