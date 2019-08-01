import express from "express"
import passport from "passport"
import Arena from "bull-arena"
import { container, ID } from "@app/di"
import { JobQueueManager } from "@app/jobs"
import constants from "@app/constants"
import { isTesting } from "@app/util"

const router = express.Router()

if (!isTesting) {
  let jobQueueManager = container.get<JobQueueManager>(ID.JOB_QUEUE_MANAGER)

  const arena = Arena(
    {
      queues: jobQueueManager.getQueueInfo()
    },
    {
      port: constants.bull.arena.port,
      basePath: "/bull",
      disableListen: true
    }
  )

  router.use(
    "/bull",
    passport.authenticate("admin_basic_auth", { session: false }),
    (req, res, next) => {
      res.locals.basepath = "/bull"
      next()
    }
  )
  router.use("/", arena)
}

export default router
