import { DAG } from './dag'

describe('DAG', () => {
  it('should add a node', () => {
    const dag = new DAG()

    const node = dag.addNode('test')

    expect(node).toMatchObject({ data: 'test', id: expect.any(Number), children: expect.any(Set) })
  })

  it('should add an edge', () => {
    const dag = new DAG()
    const node1 = dag.addNode('test1')
    const node2 = dag.addNode('test2')

    dag.addEdge(node1.id, node2.id)

    expect(node1.children.has(node2)).toBe(true)
  })

  it("can not add an edge to a node that doesn't exist", () => {
    const dag = new DAG()

    expect(() => dag.addEdge(1, 2)).toThrow()
  })

  it('throws if a node tries to child itself', () => {
    const dag = new DAG()

    const node = dag.addNode('test')

    expect(() => dag.addEdge(node.id, node.id)).toThrow()
  })

  it.todo('throws an error if adding an edge would create a cycle')
  it.todo('can provide a topological sort of the nodes')
})
