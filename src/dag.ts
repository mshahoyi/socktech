import assert from 'assert'

export class DAGNode<T> {
  public children: Set<DAGNode<T>> = new Set<DAGNode<T>>()

  constructor(
    public data: T,
    public id = Math.random(),
  ) {}

  addChild(node: DAGNode<T>): void {
    this.children.add(node)
  }

  deleteChild(node: DAGNode<T>): void {
    this.children.delete(node)
  }
}

export class DAG<T> {
  private nodes: Map<number, DAGNode<T>> = new Map()

  addNode(data: T, id = Math.random()): DAGNode<T> {
    if (this.nodes.has(id)) return this.nodes.get(id)!

    const newNode = new DAGNode(data, id)
    this.nodes.set(id, newNode)
    return newNode
  }

  addEdge(fromId: number, toId: number): void {
    assert(fromId !== toId, "Can't add an edge to a node that is the same as the origin")

    const originNode = this.nodes.get(fromId)
    const targetNode = this.nodes.get(toId)

    if (!originNode || !targetNode) throw new Error(`Original or target node do not exist`)

    originNode.addChild(targetNode)
  }

  getNodes(): IterableIterator<DAGNode<T>> {
    return this.nodes.values()
  }

  getNode(id: number): DAGNode<T> | undefined {
    return this.nodes.get(id)
  }
}
