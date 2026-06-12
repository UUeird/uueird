import { defineCollection, z } from 'astro:content';

const releases = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    artwork: z.string().url(),
    date: z.string(),
    bandcamp_embed: z.object({
      type: z.enum(['album', 'track']),
      id: z.string(),
    }),
    links: z.object({
      bandcamp: z.string().url().optional(),
      spotify: z.string().url().optional(),
      apple_music: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
      amazon_music: z.string().url().optional(),
      beatport: z.string().url().optional(),
      juno: z.string().url().optional(),
    }),
  }),
});

export const collections = { releases };
