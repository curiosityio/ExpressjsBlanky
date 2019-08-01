// import mung, { Transform } from "express-mung"
import mung from "express-mung"
import { RequestHandler, Request, Response } from "express"
import { DefaultErrorHandler } from "./default_error_handler"

mung.onError = DefaultErrorHandler

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransformBodyHandler = (body: {}, request: Request, response: Response) => any
// When This PR gets merged: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/37302 I can bring this below code back.
// type TransformBodyHandler = Transform

export const getTransformResponseBodyMiddleware = (
  handler: TransformBodyHandler
): RequestHandler => {
  return mung.json(handler, {
    mungError: true
  })
}
