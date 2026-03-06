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
    groups: z.array(
      z.enum([
        "urgent-help",
        "general-support",
        "youth-support",
        "peer-support",
        "bereavement-support",
        "family-support",
      ]),
    ),
    forWho: z.string().optional(),
    phone: z.string().optional(),
    text: z.string().optional(),
    email: z.string().optional(),
    localNote: z.string().optional(),
  }),
});

const guides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    order: z.number(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

const insights = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  services,
  resources,
  guides,
  insights,
};
