import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const SECTIONS = {
  'coin-scene': 'Coin Scene',
  'bag-talk': 'Bag Talk',
  'geek-shit': 'Geek Shit',
  'wtf': 'WTF',
  'bro-what': 'Bro, What?',
} as const;

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    section: z.enum(['coin-scene', 'bag-talk', 'geek-shit', 'wtf', 'bro-what']),
    author: z.string().default('CoinMobb'),
    date: z.coerce.date(),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
    // 1-5 puts the story in Hot Shit at that position. Leave empty otherwise.
    hot: z.number().int().min(1).max(5).optional(),
    // Pin to the top of the homepage.
    lead: z.boolean().default(false),
    // Slug of a guide to plug at the end of the story.
    guide: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    price: z.string(),
    level: z.number().int().min(1).default(1),
    // Checkout link from your payment provider.
    buyUrl: z.string().default('#'),
    cover: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { stories, guides };
