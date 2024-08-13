import { queue } from './queue'

describe('queue', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    queue.clear()
  })

  it('can schedule jobs and process them', (done) => {
    queue.dequeue('SEND_EMAIL', async (job) => {
      expect(job.type).toBe('SEND_EMAIL')
      expect(job.userData.eventName).toBe('test')
      expect(job.userData.userEmail).toBe('test@test.com')
      expect(job.actionData.body).toBe('test body')
      expect(job.actionData.subject).toBe('test subject')
      done()
    })

    queue.addJob({
      type: 'SEND_EMAIL',
      userData: { eventName: 'test', userEmail: 'test@test.com' },
      actionData: { body: 'test body', subject: 'test subject' },
      flowId: 1,
      nodeId: 2,
    })
  })

  it('subscribes workers to the correct job type', (done) => {
    queue.dequeue('SEND_EMAIL', async () => {
      done("Shouldn't be called")
    })
    queue.dequeue('WAIT', async () => {
      done()
    })

    queue.addJob({
      type: 'WAIT',
      userData: { eventName: 'test', userEmail: 'test@test.com' },
      actionData: { time: 10000 },
      flowId: 1,
      nodeId: 2,
    })
  })

  it('can delay jobs', (done) => {
    queue.dequeue('WAIT', async (job) => {
      expect(job.type).toBe('WAIT')
      expect(job.userData.eventName).toBe('test')
      expect(job.userData.userEmail).toBe('test@test.com')
      done()
    })

    queue.addJob({
      type: 'WAIT',
      userData: { eventName: 'test', userEmail: 'test@test.com' },
      delay: 10000,
      actionData: { time: 10000 },
      flowId: 1,
      nodeId: 2,
    })
    jest.runOnlyPendingTimers()
  })

  it.skip("a second job won't be processed until the first job is finished", (done) => {
    const fn = jest.fn()

    queue.dequeue('SEND_EMAIL', fn)

    queue.addJob({
      type: 'WAIT',
      userData: { eventName: 'test', userEmail: 'test@test.com' },
      delay: 10000,
      actionData: { time: 10000 },
      flowId: 1,
      nodeId: 2,
    })
    jest.runOnlyPendingTimers()
  })
})
