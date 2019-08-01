import { RequestHandler } from "express"
import humps from "humps"
import { getTransformResponseBodyMiddleware } from "./util"

export const TransformResponseBodyMiddleware: RequestHandler = getTransformResponseBodyMiddleware(
  (body, req, res) => {
    return humps.decamelizeKeys(body)
  }
)
