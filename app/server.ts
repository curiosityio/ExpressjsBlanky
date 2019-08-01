// Setup all dependencies for dependency injection here. Important to do here as we allow overriding for testing.
import "./di"
import "./email"
import "./jobs"

import express from "express"
import bodyParser from "body-parser"
import { AddressInfo } from "net"
import passport from "passport"
import trimBody from "connect-trim-body"
import helmet from "helmet"
import {
  DefaultErrorHandler,
  ErrorResponseHandlerMiddleware,
  TransformResponseBodyMiddleware
} from "./middleware"
import { Server } from "http"
import controllers from "./controller"
import "./middleware/auth"
import * as logger from "./logger"
import compression from "compression"

export const startServer = (): Server => {
  let app = express()

  logger.initAppBeforeMiddleware(app)

  app.enable("trust proxy")
  app.use("/", express.static(__dirname + "/static")) // Host files located in the `./static` directory at the root.
  app.use(bodyParser.urlencoded({ extended: false, limit: "100kb" }))
  app.use(bodyParser.json({ limit: "100kb" }))
  app.use(trimBody())
  app.use(passport.initialize())
  app.use(helmet())
  app.use(compression())
  app.use(TransformResponseBodyMiddleware)

  app.use(controllers)

  app.use(ErrorResponseHandlerMiddleware)

  logger.initAppAfterMiddleware(app)

  process.on("uncaughtException", (err: Error) => {
    logger.error(err)
  })
  app.use(DefaultErrorHandler)

  app.set("port", 5000)

  let server = app.listen(app.get("port"), () => {
    logger.debug(
      `Server started. Listening at: ${(server.address() as AddressInfo).address}:${
        (server.address() as AddressInfo).port
      }`
    )
  })

  return server
}
