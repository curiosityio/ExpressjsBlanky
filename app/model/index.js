/* @flow */

import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import type {Options} from 'sequelize'
export {Sequelize}
const env: string = process.env.NODE_ENV || "development"
const config: Options = require("../../config/config.json")[env]
const winston: Object = require('winston')

// define sets defaults for every model that is created.
config.define = {
  underscored: true, // convert camelCase column names to underscored.
  underscoredAll: true, // convert camelCase table names to underscored.
  paranoid: false // when deleting rows, don't delete, set deleted_at timestamp for row instead.
}
config.operatorsAliases = false // use the new type of sequelize operators: http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
config.logging = false // Prevent console.log statements. I can turn them on via DEBUG flag in the test commands anyway.
export const sequelize: Sequelize = new Sequelize(((config.database: any): string), config.username, config.password, config)

import {User, UserSequelizeModel} from './user'
import {FcmToken, FcmTokenSequelizeModel} from './fcm_token'

// Used for other models to refer to each other for foreign keys and such. These are Sequelize models.
export const models: Object = {}

new UserSequelizeModel(sequelize).define()
new FcmTokenSequelizeModel(sequelize).define()

models[User.tableName] = sequelize.model(User.tableName)
models[FcmToken.tableName] = sequelize.model(FcmToken.tableName)

// We must first *define* all of the models with Sequelize before we call associate because of foreign key constraints, create them all to avoid "model not found" exceptions before dependencies are created.
for (var modelKey: string in models) {
  const model: Object = models[modelKey]
  model.associate(model)
}

export {User, FcmToken}