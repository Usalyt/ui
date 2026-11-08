import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        sidebar: z
          .object({
            hidden: z.boolean().default(false),
            order: z.number().optional(),
            label: z.string().optional(),
            badge: z.any().optional(),
            attrs: z.any().optional()
          })
          .default({ hidden: false })
      })
    })
  })
};
