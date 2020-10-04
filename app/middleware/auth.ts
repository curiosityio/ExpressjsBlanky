import passport from "passport"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as AnonymousStrategy } from "passport-anonymous"
import { BasicStrategy } from "passport-http"
import { UserModel } from "../model"
import { Env } from "../env"
import { RequestHandler } from "express"

export enum AuthType {
  AdminBasic = "admin_basic_auth",
  AdminBearer = "admin_bearer_auth",
  UserBearer = "user_bearer_auth",
  UserBearerOptional = "user_bearer_auth_optional"
}

export const authMiddleware = (authType: AuthType): RequestHandler => {
  switch (authType) {
    case AuthType.UserBearerOptional: {
      return passport.authenticate([AuthType.UserBearer, "anonymous"], { session: false })
    }
    default: {
      return passport.authenticate(authType, { session: false })
    }
  }
}

passport.use(new AnonymousStrategy())

passport.use(
  "admin_bearer_auth",
  new BearerStrategy((token, done) => {
    if (token === Env.auth.adminToken) {
      return done(null, true)
    }
    return done(null, false)
  })
)

// Basic auth where username is 'admin' and password is the password above.
passport.use(
  "admin_basic_auth",
  new BasicStrategy((userId, password, done) => {
    if (userId === "admin" && password === Env.auth.adminToken) {
      return done(null, true)
    } else {
      return done(null, false)
    }
  })
)

/**
 * Note: If a user does not exist, that means they do not have access to the content. Only admins can give you access which is currently granted by you buying a Kajabi product.
 */
passport.use(
  "user_bearer_auth",
  new BearerStrategy(async (token, done) => {
    const user = await UserModel.findUserByAccessToken(token)
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  })
)
