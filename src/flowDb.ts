import { z } from 'zod'
import sampleFlows from './sampleFlows.json'
import { Flow } from './flow'
import { ZActionType, zSampleFlow } from './zTypes'

// This is just a mock database for demonstration purposes. In a real-world application, you would use a database like MongoDB or Postgres.
class FlowDbService {
  private flows: Flow[]

  constructor() {
    const result = z.array(zSampleFlow).safeParse(sampleFlows)
    if (!result.success) throw new Error(result.error.message)
    this.flows = result.data.map((input) => {
      const flow = new Flow(input.triggeringEventName)
      input.actions.forEach((inputAction) =>
        flow.addAction(
          { actionData: inputAction.actionData, actionType: inputAction.actionType as ZActionType },
          inputAction.fromId || flow.triggerNode.id,
          inputAction.id,
        ),
      )
      return flow
    })
  }

  async getFlowsForEvent(eventName: string): Promise<Flow[]> {
    return this.flows.filter((flow) => flow.triggeringEvent === eventName)
  }
}

export const flowDb = new FlowDbService()
