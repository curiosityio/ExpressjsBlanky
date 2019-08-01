import express from "express"
import expressRoutesVersioning from "express-routes-versioning"
import * as controller010 from "@app/controller/0.1.0/admin"
import passport from "passport"
import { getMiddleware } from "./util"

const routesVersioning = expressRoutesVersioning()
const router = express.Router()

/**
 * @apiDefine Endpoint_POST_adminuser
 *
 * @apiName Add user to database
 * @apiDescription Admin can add new users to the application by email.
 */
router.post(
  "/admin/user",
  passport.authenticate("admin_bearer_auth", { session: false }),
  routesVersioning({
    "0.1.0": getMiddleware(controller010.addUser)
  })
)

export default router
