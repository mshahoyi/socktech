import { flowDb } from './flowDb'

describe('flowDb', () => {
  it('correctly reads the sample flows', async () => {
    const flows = await flowDb.getFlowsForEvent('websiteSignup')

    expect(flows.length).toBe(1)
    expect(flows[0].triggeringEvent).toBe('websiteSignup')
  })
})
