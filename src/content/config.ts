import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    order: z.number(),
    serviceArea: z.string().optional(),
    highlightTitle: z.string().optional(),
    highlightItems: z.array(z.string()).optional(),
  }),
});

const resources = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    organisation: z.string(),
    url: z.string().url(),
    summary: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  services,
  resources,
};
