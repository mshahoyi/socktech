import { z } from 'zod'

export const zID = z.number()
export type ZID = z.infer<typeof zID>

export const zIngestBody = z.object({
  eventName: z.string().min(1),
  userEmail: z.string().min(1),
})
export type ZIngestBody = z.infer<typeof zIngestBody>

export const zActionType = z.enum(['SEND_EMAIL', 'WAIT'])
export type ZActionType = z.infer<typeof zActionType>

export const zSampleFlow = z.object({
  triggeringEventName: z.string().min(1),
  actions: z.array(
    z.object({
      id: zID,
      fromId: zID.nullable(),
      actionType: zActionType,
      actionData: z.union([
        z.object({
          subject: z.string().min(1),
          body: z.string().min(1),
        }),
        z.object({ time: z.number() }),
      ]),
    }),
  ),
})
export type ZSampleFlow = z.infer<typeof zSampleFlow>
