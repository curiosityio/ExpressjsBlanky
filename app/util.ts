import dotenv, { DotenvConfigOptions } from "dotenv"
import path from "path"

export const isDevelopment = process.env.NODE_ENV === "development"

export const isProduction = process.env.NODE_ENV === "production"

export const isStaging = process.env.NODE_ENV === "staging"

export const isTesting = process.env.NODE_ENV === "test"

export const isCi = process.env.CI

// Allows you to dynamically enable debug logging or not by adding LOG=true to the beginning of your CLI command.
export const enableLogging: boolean = "LOG" in Object.keys(process.env)

export const isRunningDatabase = process.env.RUNNING_DATABASE === "true"

export const isRunningOnProduction = (isProduction || isStaging) && !isCi

export enum Env {
  development = "development",
  production = "production",
  test = "test",
  staging = "staging"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unreachableCode(value?: any): never {
  throw new Error(
    `Unreachable code: ${value ||
      "(value undefined)"}. Make sure you have all of your options defined`
  )
}

export const env: Env = ((): Env => {
  if (isDevelopment) return Env.development
  if (isTesting) return Env.test
  if (isProduction) return Env.production
  if (isStaging) return Env.staging
  return unreachableCode(process.env.NODE_ENV)
})()

const setupEnv = (): void => {
  let envFilename: string = ((): string => {
    if (env == Env.development || env == Env.test) return ".env.development"
    if (env == Env.production) return ".env.production"
    if (env == Env.staging) return ".env.staging"
    return unreachableCode(env)
  })()

  const dotEnvConfig: DotenvConfigOptions = {
    path: path.join(__dirname, "../", envFilename!)
  }
  if (enableLogging) dotEnvConfig.debug = true
  const result = dotenv.config(dotEnvConfig)

  if (result.error) {
    throw result.error
  }
}

setupEnv()
