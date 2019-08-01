import { Dialect } from "sequelize"
export interface DatabaseConnection {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: Dialect
}

const testConnection: DatabaseConnection = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: "localhost",
  port: 5433,
  dialect: "postgres"
}

const developmentConnection: DatabaseConnection = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: "localhost",
  port: 5432,
  dialect: "postgres"
}

const stagingConnection: DatabaseConnection = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: process.env.DATABASE_HOST!,
  port: 5432,
  dialect: "postgres"
}

const productionConnection: DatabaseConnection = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  host: process.env.DATABASE_HOST!,
  port: 5432,
  dialect: "postgres"
}

const connections: {
  development: DatabaseConnection
  production: DatabaseConnection
  staging: DatabaseConnection
  test: DatabaseConnection
} = {
  development: developmentConnection,
  production: productionConnection,
  staging: stagingConnection,
  test: testConnection
}

// Exists for sequelize-cli to find the connections as the main export.
// Note: Must have the export default be the same object as the module.exports or, module.exports will export erase all other exports.
export default connections
module.exports = connections
