// Setup .env
import "./util"

import { startServer } from "./server"
import { initDatabase } from "./model"
import { isRunningDatabase } from "./util"

const run = async (): Promise<void> => {
  if (isRunningDatabase) {
    await initDatabase() // We currently do not use a database.
  }

  startServer()
}

run()
