import { z } from 'zod'

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
})

export type Article = z.infer<typeof ArticleSchema>
