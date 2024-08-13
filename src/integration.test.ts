import { emailService } from './emailService'
import { processIncomingEvent } from './processIncomingEvent'
import { processQueueJobs } from './processQueueJobs'
import { queue } from './queue'

jest.mock('./emailService')

describe('integration', () => {
  beforeEach(() => {
    queue.clear()
  })

  it('correctly processes incoming events', (done) => {
    processQueueJobs()

    processIncomingEvent({ eventName: 'socksPurchased', userEmail: 'test@test.com' })
      .then(() => wait(3000))
      .then(() => {
        expect(emailService.sendEmail).toHaveBeenCalledTimes(2)
        done()
      })
  })
})

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    jest.useRealTimers()
    setTimeout(() => {
      resolve()
      jest.useFakeTimers()
    }, ms)
  })
