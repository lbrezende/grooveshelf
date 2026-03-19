import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

const sampleItems = [
  { id: 1, type: "image", title: "Coleção de Vinis", desc: "Uma coleção curada de vinis raros", url: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&q=80", span: "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2" },
  { id: 2, type: "image", title: "Vitrola Vintage", desc: "Toca-discos clássico em ação", url: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 3, type: "image", title: "Show ao Vivo", desc: "A energia de um show inesquecível", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 4, type: "image", title: "Estúdio Musical", desc: "Onde a magia acontece", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2" },
  { id: 5, type: "image", title: "Loja de Discos", desc: "Paraíso do colecionador", url: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 6, type: "image", title: "Guitarra Elétrica", desc: "Rock and Roll para sempre", url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2" },
];

const meta: Meta<typeof InteractiveBentoGallery> = {
  title: "UI/BentoGallery",
  component: InteractiveBentoGallery,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    layout: "fullscreen",
  },
  args: {
    mediaItems: sampleItems,
    title: "Galeria de Imagens",
    description: "Explore a coleção com hover interativo",
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveBentoGallery>;

export const Default: Story = {};
