import "@app/util" // Setup .env
import { isTesting } from "@app/util"
import "../index"

beforeEach(async () => {
  if (!isTesting) {
    throw new Error("You can only run tests in testing environments.")
  }
})
