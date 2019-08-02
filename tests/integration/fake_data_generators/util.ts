import { FakeDataGenerator } from "./types"

export const createDependencies = async (dependencies: FakeDataGenerator[]): Promise<void> => {
  for (let dep of dependencies) {
    await dep.create()
  }
}
