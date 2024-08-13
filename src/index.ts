import express from 'express'
import { zIngestBody } from './zTypes'
import { flowDb } from './flowDb'
import { processIncomingEvent } from './processIncomingEvent'
import { processQueueJobs } from './processQueueJobs'

processQueueJobs()

const app = express()
const port = 3000

app.use(express.json())

app.post('/ingest', (req, res) => {
  const result = zIngestBody.safeParse(req.body)
  if (!result.success) return res.status(400).send(result.error)

  processIncomingEvent(result.data)

  res.sendStatus(200)
})

app.get('/', (req, res) => {
  res.send(flowDb.getFlowsForEvent('websiteSignup'))
})

app.listen(port, () => {
  console.log('Socktech app listening on port 3000!')
})
