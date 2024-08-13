import { Flow } from './flow'

describe('Flow', () => {
  it('can be created', () => {
    const flow = new Flow('websiteSignup', 'flow name', 1)

    expect(flow.triggeringEvent).toBe('websiteSignup')
    expect(flow.triggerNode).toMatchObject({
      data: { eventName: 'websiteSignup' },
      id: expect.any(Number),
      children: expect.any(Set),
    })
  })

  it('can add actions to the flow', () => {
    const flow = new Flow('websiteSignup', 'flow name', 1)

    const actionNode = flow.addAction({ actionData: { time: 10 }, actionType: 'WAIT' }, flow.triggerNode.id)

    expect(actionNode).toMatchObject({
      data: { actionData: { time: 10 }, actionType: 'WAIT' },
      id: expect.any(Number),
      children: expect.any(Set),
    })
  })
})
