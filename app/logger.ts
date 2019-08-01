import { isRunningOnProduction, enableLogging } from "./util"
import Honeybadger from "honeybadger"
import { Application } from "express"

if (isRunningOnProduction) {
  Honeybadger.configure({
    apiKey: process.env.HONEY_BADGER_API_KEY!
  })
}

// To leave breadcrumbs, track events that happen that are attached to errors that get reported.
export const track = (event: Object): void => {
  Honeybadger.setContext(event)
}

export const initAppBeforeMiddleware = (app: Application): void => {
  if (isRunningOnProduction) {
    app.use(Honeybadger.requestHandler) // Use *before* all other app middleware.

    Honeybadger.resetContext() // To prepare for new request, reset context.
  }
}

export const initAppAfterMiddleware = (app: Application): void => {
  if (isRunningOnProduction) {
    app.use(Honeybadger.errorHandler) // Use *after* all other app middleware (but before custom error middleware)
  }
}

export const error = (error: Error, extra?: Object): void => {
  if (!isRunningOnProduction) {
    let extraInfo = extra ? JSON.stringify(extra) : "(none)"
    console.error(`ERROR: Extra: ${extraInfo}, message: ${error.message}, stack: ${error.stack}`)
  } else {
    Honeybadger.notify(error, {
      context: extra || {},
      message: error.message || "none"
    })
  }
}

export const debug = (message: string, extra?: Object): void => {
  if (!isRunningOnProduction || enableLogging) {
    let extraInfo = extra ? JSON.stringify(extra) : "(none)"
    console.debug(`DEBUG: Extra: ${extraInfo}, message: ${message}`)
  }
}
