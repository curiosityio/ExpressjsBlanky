/* @flow */

export const redisHost: string = "app-redis"
import Queue from 'bull'
import winston from 'winston'
import SendPushNotificationUserJob from './send_push_notification_user'
import type {Job} from './def'
export const jobs: Array<Job> = [SendPushNotificationUserJob]

jobs.forEach((job: Job) => {
  const jobName: string = job.name
  const queue: Queue = job.queue()

  queue.on('error', (err: Error) => {
    winston.log('error', `Job ${jobName} ERROR. Message: ${err.message}, stack: ${err.stack}.`)
  })
  queue.on('failed', (job: Job, err: Error) => {
    winston.log('error', `Job ${jobName} FAILED. Id: ${job.jobId}, message: ${err.message}, data: ${JSON.stringify(job.data)}, stack: ${err.stack}.`)
  })
  queue.on('completed', (job: Job, result: Object) => {
    if (process.env.NODE_ENV === "development") {
      winston.log('info', `Job ${jobName} completed. Id: ${job.jobId}.`)
    }
  })
  queue.process((jobToProcess: Job): Promise<any> => {
    if (process.env.NODE_ENV === "development") {
      winston.log('info', `Job ${jobName} running. Id: ${job.jobId}.`)
    }
    return job.job(jobToProcess.data)
  })
})
