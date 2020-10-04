import { UserModel, FcmTokenModel } from "../model"
import { EmailSender } from "../email"
import { Env } from "../env"

export interface UserController {
  sendLoginLink(email: string): Promise<void>
  exchangePasswordlessToken(token: string): Promise<UserModel | null>
  addFcmToken(userId: number, token: string): Promise<void>
}

export class AppUserController implements UserController {
  constructor(private emailSender: EmailSender) {}

  async sendLoginLink(email: string): Promise<void> {
    const createUserResult = await UserModel.findUserOrCreateByEmail(email)
    const userCreated = createUserResult[1]
    const user = createUserResult[0]
    const loginLink = encodeURIComponent(`${Env.appHost}/?token=${user.passwordToken!}`)
    const passwordlessLoginLink = `${Env.dynamicLinkHostname}/?link=${loginLink}&apn=${Env.mobileAppInfo.bundleId}&ibi=${Env.mobileAppInfo.bundleId}`

    await this.emailSender.sendLogin(userCreated, user.email, {
      appLoginLink: passwordlessLoginLink
    })
  }

  async exchangePasswordlessToken(token: string): Promise<UserModel | null> {
    let user = await UserModel.findByPasswordlessToken(token)
    if (!user || !user.passwordTokenCreated) {
      return null
    }

    const yesterday24HoursAgo: Date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    if (user.passwordTokenCreated < yesterday24HoursAgo) {
      return null
    }

    user = await user.newAccessToken()

    return user
  }

  async addFcmToken(userId: number, token: string): Promise<void> {
    const existingTokens = await FcmTokenModel.findByUserId(userId)

    if (existingTokens.length >= 100) {
      // we have a maximum number of tokens per user. set by firebase https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-multiple-devices
      await existingTokens[0].delete()
    }

    await FcmTokenModel.create(userId, token)
  }
}
