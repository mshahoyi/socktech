import { flowDb } from './flowDb'
import { scheduleActions } from './scheduleActions'
import { ZIngestBody } from './zTypes'

export async function processIncomingEvent(input: ZIngestBody) {
  const matchingFlows = await flowDb.getFlowsForEvent(input.eventName)
  matchingFlows.forEach((flow) =>
    scheduleActions({
      flowId: flow.id,
      parentNodeId: flow.triggerNode.id,
      childNodes: [...flow.triggerNode.children],
      userData: input,
    }),
  )
}
