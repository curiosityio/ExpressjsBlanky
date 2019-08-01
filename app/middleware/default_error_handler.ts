import { ErrorRequestHandler } from "express"
import * as logger from "@app/logger"
import { isProduction, isStaging } from "@app/util"
import { SystemError } from "@app/responses"

export const DefaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    logger.error(err)

    if (res.headersSent) {
      next(err)
    } else {
      const message = isProduction || isStaging ? "System error. Please try again." : err.message
      res.status(SystemError.code).send(new SystemError(message))
    }
  }
}
