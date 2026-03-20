import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactCard } from "@/components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const meta: Meta<typeof ContactCard> = {
  title: "UI/ContactCard",
  component: ContactCard,
  parameters: {
    backgrounds: { default: "grooveshelf" },
    layout: "centered",
  },
  args: {
    title: "Tem dúvidas?",
    description:
      "Se você tem alguma dúvida sobre o GrooveShelf, quer saber mais sobre os planos, ou precisa de ajuda — manda pra gente.",
    contactInfo: [
      { icon: MailIcon, label: "Email", value: "leandro@bilhon.com" },
      { icon: MapPinIcon, label: "Localização", value: "São Paulo, Brasil" },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof ContactCard>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-5xl">
      <ContactCard {...args}>
        <form className="w-full space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Nome</Label>
            <Input type="text" placeholder="Seu nome" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="seu@email.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Mensagem</Label>
            <Textarea placeholder="Escreva sua mensagem..." />
          </div>
          <Button className="w-full" type="button">
            Enviar mensagem
          </Button>
        </form>
      </ContactCard>
    </div>
  ),
};
