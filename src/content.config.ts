import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const evidence = z.enum(['verified-source', 'runtime-verification-required', 'user-supplied', 'status-confirmation-required']);
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(), shortTitle: z.string(), order: z.number(), zone: z.string(), accent: z.enum(['gravity','time','ants','anipal']),
    status: z.object({ label: z.string(), evidence }),
    headline: z.string(), premise: z.string(), proof: z.string(), capabilities: z.array(z.string()),
    features: z.array(z.object({ title: z.string(), description: z.string(), sources: z.array(z.string()).min(1), note: z.string().optional() })).min(1),
    hero: z.string(), supporting: z.array(z.string()),
    play: z.object({ title: z.string(), description: z.string() }),
    explode: z.object({ title: z.string(), description: z.string(), layers: z.array(z.object({ title: z.string(), detail: z.string() })) }),
    cases: z.array(z.object({ id: z.string(), title: z.string(), player: z.string(), technical: z.string(), tradeoff: z.string(), evidence, claims: z.array(z.string()) })),
    notes: z.array(z.string()), attribution: z.string().optional(), playUrl: z.url().optional(), next: z.string(),
  })
});
export const collections = { projects };
