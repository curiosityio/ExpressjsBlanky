/* @flow */

import {models} from '../app/model'
import {sequelize, User} from '../app/model'
import {TestData} from '../app/model/type'
import winston from 'winston'
import {startServer as serverStart, closeServer as serverClose} from '../app/server'
import {ADMIN_TOKEN} from '../app/middleware/auth'

export const authHeader: (user: User) => Object = (user: User): Object => {
  if (!user.access_token) { throw new Error(`Access token cannot be null.`) }
  return {'Authorization': `Bearer ${user.access_token}`}
}

export const adminAuthHeader: () => Object = (): Object => {
  return {'Authorization': `Bearer ${ADMIN_TOKEN}`}
}

export const endpointVersionHeader: (version: string) => Object = (version: string): Object => {
  return {'accept-version': version}
}

export const startServer: () => Object = (): Object => {
  return serverStart()
}

export const closeServer: () => void = () => {
  serverClose()
}

export const checkDebug: () => void = () => {
  if (process.env.NODE_ENV !== "testing" && process.env.NODE_ENV !== "docker-test") {
    throw new Error('You can only run tests in testing environments.')
  }
}

export const setupDb: (modelsToCreate: ?Array<TestData<any>>) => Promise<void> = async(modelsToCreate: ?Array<TestData<any>>): Promise<void> => {
  process.env.NODE_ENV = 'testing'
  await sequelize.sync({force: true})

  await createModels(modelsToCreate)
}

const createModels: (modelsToCreate: ?Array<TestData<any>>) => Promise<void> = async(modelsToCreate: ?Array<TestData<any>>): Promise<void> => {
  if (modelsToCreate && modelsToCreate.length > 0) {
    var modelObjectToBeInserted: Array<TestData<any>> = []
    modelsToCreate.forEach((modelToCreate: TestData<any>) => {
      modelObjectToBeInserted = modelObjectToBeInserted.concat(createModelDependenciesList(modelToCreate))
    })
    const modelsToBeCreatedSet: Set<TestData<any>> = new Set(modelObjectToBeInserted) // Remove the duplicates.

    await sequelize.transaction({
      deferrable: sequelize.Deferrable.SET_DEFERRED // If I do not include this, postgres will throw a fit with foreign key constraints even if I insert data into the database in the correct order to satisfy constraints. 
    }, (transaction: Object): Promise<Array<Object>> => {
      var promises: Array<Promise<any>> = []
      Array.from(modelsToBeCreatedSet).forEach((modelToCreate: TestData<any>) => {
        // Some test data may have an "id" property to be used *after* an object has been queried from a database. Here, we are simply going to delete it since it will be an autoincremented field.
        const testObject: Object = modelToCreate.testData
        delete testObject.id
        delete testObject.createdAt
        delete testObject.updatedAt

        promises.push(modelToCreate.model.create(testObject, {transaction: transaction}))
      })
      return Promise.all(promises)
    })
  }
}

// Takes a TestData and returns an array full of all of the dependencies needed to create that Model in TestData.
// Pretty much creates a tree of dependencies from the top node, "modelToCreate" of all the dependencies of that top node so they call get inserted into the DB in order.
const createModelDependenciesList: (modelToCreate: TestData<any>) => Array<TestData<any>> = (modelToCreate: TestData<any>): Array<TestData<any>> => {
  return createModelDependenciesListHelper(modelToCreate, [modelToCreate])
}

const createModelDependenciesListHelper: (modelToCreate: TestData<any>, recursiveArray: Array<TestData<any>>) => Array<TestData<any>> = (modelToCreate: TestData<any>, recursiveArray: Array<TestData<any>>): Array<TestData<any>> => {
  if (!modelToCreate.dependencies || modelToCreate.dependencies.length <= 0) {
    return [modelToCreate]
  }

  modelToCreate.dependencies.forEach((dep: Object) => {
    const deps: Array<TestData<any>> = createModelDependenciesListHelper(dep, [dep])
    recursiveArray = deps.concat(recursiveArray)
  })

  return recursiveArray
}
