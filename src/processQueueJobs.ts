import { emailService } from './emailService'
import { flowDb } from './flowDb'
import { queue } from './queue'
import { scheduleActions } from './scheduleActions'
import { zActionType, ZIngestBody } from './zTypes'

export function processQueueJobs() {
  console.info('Worker: Starting')

  queue.dequeue(zActionType.enum.SEND_EMAIL, async (job) => {
    console.info(`Worker: Sending email. Subject: ${job.actionData.subject}, Body: ${job.actionData.body}`)
    await emailService.sendEmail()
    await scheduleChildActions({ flowId: job.flowId, nodeId: job.nodeId, userData: job.userData })
  })

  queue.dequeue(zActionType.enum.WAIT, async (job) => {
    console.info('Worker: Wait over!')
    await scheduleChildActions({ flowId: job.flowId, nodeId: job.nodeId, userData: job.userData })
  })
}

async function scheduleChildActions(args: { flowId: number; nodeId: number; userData: ZIngestBody }) {
  const flow = await flowDb.getFlowById(args.flowId)
  if (!flow) return

  const node = flow.getActionNode(args.nodeId)
  await scheduleActions({
    flowId: args.flowId,
    parentNodeId: node.id,
    childNodes: [...node.children],
    userData: args.userData,
  })
}
