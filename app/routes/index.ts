import express from "express"
import userRouter from "./user"
import adminRouter from "./admin"
import path from "path"
import { JobQueueManager } from "../jobs"
import { Dependency, Di } from "../di"

const router = express.Router()

router.get("/", (req, res, next) => {
  return res.send("Hold on, nothing to see here.")
})

let version: string | undefined
router.get("/version", async (req, res, next) => {
  if (!version) {
    const filePath: {
      version: string
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(path.join(__dirname, "../package.json"))

    version = filePath.version
  }

  const jobs: JobQueueManager = Di.inject(Dependency.JobQueueManager)
  await jobs.queueRandom()

  return res.send({
    version: version
  })
})

router.use(userRouter)
router.use(adminRouter)

export default router
