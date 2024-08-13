import { ActionData } from './flow'
import { ZActionType, ZIngestBody } from './zTypes'

type JobType = ZActionType

type Job<Type extends JobType = JobType> = {
  type: Type
  userData: ZIngestBody
  delay?: number
  actionData: ActionData[Type]
}

type WorkerCb = Parameters<InstanceType<typeof Queue>['dequeue']>[1]

// Simple in memory queue. Not suitable for production. Use a real queueing system like RabbitMQ or SQS.
class Queue {
  private jobs: Job[] = []
  private workers = {} as Record<JobType, WorkerCb[]>
  private timeouts: NodeJS.Timeout[] = []

  addJob<T extends JobType>({ delay, ...job }: Job<T>) {
    if (delay) return this.timeouts.push(setTimeout(() => this.addJob(job), delay))

    this.jobs.push(job)
    this.processJobs()
  }

  private processJobs() {
    const jobToProcess = this.jobs[0]
    if (!jobToProcess) return

    const randomWorkerIndex = Math.floor(Math.random() * this.workers[jobToProcess.type].length)
    this.workers[jobToProcess.type]
      [randomWorkerIndex](jobToProcess)
      .then(() => {
        this.jobs.shift()
        this.processJobs()
      })
      .catch((err) => {
        // TODO: handle error
        console.error(err)
        this.jobs.shift()
        this.processJobs()
      })
  }

  dequeue<T extends JobType>(jobType: T, cb: (job: Job<T>) => Promise<void>) {
    if (!this.workers[jobType]) this.workers[jobType] = []

    this.workers[jobType].push(cb as WorkerCb)

    this.processJobs()
  }

  clear() {
    this.jobs = []
    this.workers = {} as typeof this.workers
    this.timeouts.forEach((timeout) => clearTimeout(timeout))
    this.timeouts = []
  }
}

export const queue = new Queue()
