import logProcessErrors, { validateOptions } from 'log-process-errors'

const getOptions = (options) => {
  validateOptions(options)
  return addDefaultOptions(options)
}

const addDefaultOptions = ({ onError = defaultOnError, ...options } = {}) => ({
  ...options,
  onError,
})

// Same default `onError` as `log-process-errors`
const defaultOnError = (error) => {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
}

// Forwards to `log-process-errors`
const logProcess = ({ options, ErrorClass }) => {
  const onError = customOnError.bind(undefined, { options, ErrorClass })
  return logProcessErrors({ ...options, onError })
}

// Process errors always indicate unknown behavior. Therefore, we wrap them
// as `UnknownError` even if the underlying class is known.
// This applies whether `onError` is overridden or not.
const customOnError = async (
  { options: { onError }, ErrorClass },
  error,
  ...args
) => {
  const errorA = ErrorClass.normalize(error)
  await onError(errorA, ...args)
}

export default {
  name: 'process',
  getOptions,
  staticMethods: { logProcess },
}
