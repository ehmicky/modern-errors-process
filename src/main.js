import isPlainObj from 'is-plain-obj'
import logProcessErrors, { validateOptions } from 'log-process-errors'

const getOptions = function (options = {}) {
  if (!isPlainObj(options)) {
    throw new TypeError(`Options must be a plain object: ${options}`)
  }

  const { UnknownError, ...logProcessErrorsOptions } = options

  if (UnknownError !== undefined && typeof UnknownError !== 'function') {
    throw new TypeError(
      `"UnknownError" option must be an error class: ${UnknownError}`,
    )
  }

  validateOptions(logProcessErrorsOptions)
  return { ...logProcessErrorsOptions, UnknownError }
}

// Forwards to `log-process-errors`
const logProcess = function ({
  options: { onError, UnknownError, ...logProcessErrorsOptions },
  ErrorClass,
}) {
  if (UnknownError !== undefined && !isSubclass(UnknownError, ErrorClass)) {
    throw new TypeError(
      `"UnknownError" option "${UnknownError.name}" must be a subclass of ${ErrorClass.name}`,
    )
  }

  const onErrorA = customOnError.bind(undefined, {
    onError,
    ErrorClass,
    UnknownError,
  })
  return logProcessErrors({ ...logProcessErrorsOptions, onError: onErrorA })
}

const isSubclass = function (ErrorClass, ParentClass) {
  return ParentClass === ErrorClass || isProtoOf.call(ParentClass, ErrorClass)
}

const { isPrototypeOf: isProtoOf } = Object.prototype

// Process errors always indicate unknown behavior. Therefore, we wrap them
// as `UnknownError` even if the underlying class is known.
// This applies whether `onError` is overridden or not.
const customOnError = async function (
  { onError = defaultOnError, ErrorClass, UnknownError },
  error,
  ...args
) {
  const unknownError = normalizeError(error, ErrorClass, UnknownError)
  await onError(unknownError, ...args)
}

// Same default `onError` as `log-process-errors`
const defaultOnError = function (error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
}

const normalizeError = function (error, ErrorClass, UnknownError) {
  const cause = ErrorClass.normalize(error)
  return UnknownError === undefined || cause instanceof UnknownError
    ? cause
    : new UnknownError('', { cause })
}

export default {
  name: 'process',
  getOptions,
  staticMethods: { logProcess },
}
