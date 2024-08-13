import { DAG, DAGNode } from './dag'
import { ZActionType, zActionType } from './zTypes'

type TriggerNode = {
  eventName: string
}

export type ActionData = {
  [zActionType.enum.SEND_EMAIL]: { subject: string; body: string }
  [zActionType.enum.WAIT]: { time: number }
}

export type ActionNode<AT extends ZActionType = ZActionType> = {
  actionType: AT
  actionData: ActionData[AT]
}

export class Flow {
  private dag: DAG<TriggerNode | ActionNode> = new DAG()
  private triggerNodeId: number

  constructor(
    public triggeringEvent: string,
    public name?: string,
    public id = Math.random(),
  ) {
    const triggerNode = this.dag.addNode({ eventName: triggeringEvent })
    this.triggerNodeId = triggerNode.id
  }

  get triggerNode() {
    return this.dag.getNode(this.triggerNodeId) as Omit<DAGNode<TriggerNode>, 'children'> & {
      children: Set<DAGNode<ActionNode>>
    }
  }

  addAction(data: ActionNode, fromId: number, actionId = Math.random()) {
    const newNode = this.dag.addNode(data, actionId)
    this.dag.addEdge(fromId, newNode.id)

    return newNode
  }

  getActionNode(actionId: number): DAGNode<ActionNode> {
    return this.dag.getNode(actionId) as DAGNode<ActionNode>
  }
}
