import { DAGNode } from './dag'
import { ActionNode, ActionData } from './flow'
import { queue } from './queue'
import { ZIngestBody, zActionType } from './zTypes'

export function scheduleActions(args: {
  flowId: number
  parentNodeId: number
  childNodes: DAGNode<ActionNode>[]
  userData: ZIngestBody
}) {
  console.info('Scheduler: Scheduling action', args)

  args.childNodes.forEach((childNode) => {
    switch (childNode.data.actionType) {
      case zActionType.enum.SEND_EMAIL:
        queue.addJob({
          type: zActionType.enum.SEND_EMAIL,
          userData: args.userData,
          actionData: childNode.data.actionData as ActionData['SEND_EMAIL'],
          flowId: args.flowId,
          nodeId: childNode.id,
        })
        break
      case zActionType.enum.WAIT:
        queue.addJob({
          type: zActionType.enum.WAIT,
          userData: args.userData,
          actionData: childNode.data.actionData as ActionData['WAIT'],
          delay: (childNode.data.actionData as ActionData['WAIT']).time,
          flowId: args.flowId,
          nodeId: childNode.id,
        })
        break
    }
  })
}
