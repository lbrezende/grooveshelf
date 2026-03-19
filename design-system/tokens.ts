/**
 * GrooveShelf Design Tokens — Single Source of Truth
 *
 * Edit this file to change the design system.
 * Then run `npm run tokens` to regenerate app/globals.css.
 * Both the product and Storybook will reflect the changes.
 */

export interface DesignTokens {
  colors: Record<string, string>;
  sidebar: Record<string, string>;
  radius: string;
  spacing: number[];
  typography: {
    scale: Array<{
      name: string;
      tag: string;
      classes: string;
      description: string;
    }>;
  };
}

export const tokens: DesignTokens = {
  colors: {
    background: "#0A0A0F",
    foreground: "#E8E0F0",
    card: "#12101A",
    cardForeground: "#E8E0F0",
    popover: "#12101A",
    popoverForeground: "#E8E0F0",
    primary: "#CC00FF",
    primaryForeground: "#FFFFFF",
    secondary: "#12101A",
    secondaryForeground: "#E8E0F0",
    muted: "#2D2640",
    mutedForeground: "#A99BC4",
    accent: "#00FFFF",
    accentForeground: "#0A0A0F",
    destructive: "#FF3366",
    border: "#2A1F3D",
    input: "#2A1F3D",
    ring: "#00FFFF",
    vinyl: "#CC00FF",
    chart1: "#00FFFF",
    chart2: "#CC00FF",
    chart3: "#FF00FF",
    chart4: "#5500AA",
    chart5: "#12101A",
  },

  sidebar: {
    background: "#0A0A0F",
    foreground: "#E8E0F0",
    primary: "#CC00FF",
    primaryForeground: "#FFFFFF",
    accent: "#12101A",
    accentForeground: "#E8E0F0",
    border: "#2A1F3D",
    ring: "#00FFFF",
  },

  radius: "0.625rem",

  spacing: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],

  typography: {
    scale: [
      {
        name: "Heading 1",
        tag: "h1",
        classes: "text-5xl font-bold",
        description: "Page titles, hero headings",
      },
      {
        name: "Heading 2",
        tag: "h2",
        classes: "text-3xl font-bold",
        description: "Section headings",
      },
      {
        name: "Heading 3",
        tag: "h3",
        classes: "text-xl font-semibold",
        description: "Card titles, subsections",
      },
      {
        name: "Heading 4",
        tag: "h4",
        classes: "text-lg font-semibold",
        description: "Small headings, labels",
      },
      {
        name: "Body",
        tag: "p",
        classes: "text-base",
        description: "Default body text",
      },
      {
        name: "Small",
        tag: "small",
        classes: "text-sm",
        description: "Secondary text, captions",
      },
      {
        name: "Muted",
        tag: "span",
        classes: "text-sm text-muted-foreground",
        description: "Deemphasized text, hints",
      },
    ],
  },
};
