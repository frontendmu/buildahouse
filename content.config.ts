import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    guides: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        // One-line summary for the guide cards on the homepage. Set explicitly
        // rather than derived, so guides that open with a warning blockquote
        // still get a sensible card.
        description: z.string(),
        phase: z.number(),
        order: z.number(),
        tags: z.string(),
        // Date the facts and links in the file were last checked against
        // official sources. Surfaced on every page — see README accuracy policy.
        lastVerified: z.string(),
      }),
    }),
  },
})
