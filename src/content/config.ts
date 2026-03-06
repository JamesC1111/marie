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

export const collections = {
  services,
  resources,
};
