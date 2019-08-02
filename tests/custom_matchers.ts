import humps from "humps"
import isEqual from "lodash.isequal"

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualDecamelize(a: object): R
    }
  }
}
expect.extend({
  toEqualDecamelize(expect, actual) {
    let decalemlizedActual = humps.decamelizeKeys(actual)

    if (isEqual(expect, decalemlizedActual)) {
      return {
        message: () => `expected ${expect} to not equal ${decalemlizedActual}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${expect} to equal ${decalemlizedActual}`,
        pass: false
      }
    }
  }
})
