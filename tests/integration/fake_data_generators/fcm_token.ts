import { FcmTokenModel } from "@app/model"
import uid2 from "uid2"
import { FakeDataGenerator } from "./types"
import { UserFakeDataGenerator } from "./user"
import { createDependencies } from "./util"

export class FcmTokenFakeDataGenerator extends FcmTokenModel implements FakeDataGenerator {
  private dependencies: FakeDataGenerator[] = []

  static tokenForUserDevice(id: number, user: UserFakeDataGenerator): FcmTokenFakeDataGenerator {
    let token = uid2(200)
    let fakeModel = new FcmTokenFakeDataGenerator(id, token, user.id)

    fakeModel.dependencies.push(user)

    return fakeModel
  }

  async create() {
    await createDependencies(this.dependencies)

    await this.findOrCreateSelf()
  }
}
