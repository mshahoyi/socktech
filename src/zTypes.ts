import { z } from 'zod'

export const zIngestBody = z.object({
  eventName: z.string().min(1),
  userEmail: z.string().min(1),
})
