import { z } from "zod";

export const artistSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  genre: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  spotifyId: z.string().optional(),
});

export const albumSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  artistId: z.string().min(1, "Artista é obrigatório"),
  year: z.number().int().min(1900).max(2030).optional(),
  label: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  format: z.string().optional(),
  discogsId: z.string().optional(),
});

export const trackSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  albumId: z.string().min(1),
  duration: z.number().int().positive().optional(),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  spotifyUrl: z.string().url().optional().or(z.literal("")),
});

export const wishlistItemSchema = z.object({
  albumId: z.string().min(1),
  targetPrice: z.number().positive().optional(),
  amazonUrl: z.string().url().optional().or(z.literal("")),
});

export const listeningSessionSchema = z.object({
  albumId: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export const monthlyListSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato: YYYY-MM"),
  budget: z.number().positive().optional(),
  itemIds: z.array(z.string()),
});
