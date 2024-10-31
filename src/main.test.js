import { emitWarning } from 'node:process'
import { setImmediate } from 'node:timers/promises'

import test from 'ava'
import ModernError from 'modern-errors'
import { spy, stub } from 'sinon'
import { each } from 'test-each'

import modernErrorsProcess from 'modern-errors-process'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsProcess],
})
const UnknownError = BaseError.subclass('UnknownError')
const SiblingError = BaseError.subclass('SiblingError')

each(
  [true, { unknown: true }, { exit: 'true' }, { onError: true }],
  ({ title }, options) => {
    test.serial(`Options are validated | ${title}`, (t) => {
      t.throws(BaseError.logProcess.bind(BaseError, options))
    })
  },
)

const createProcessError = async (error) => {
  emitWarning(error)
  await setImmediate()
}

test.serial('Prints on the console by default', async (t) => {
  // eslint-disable-next-line no-restricted-globals
  const consoleError = stub(console, 'error')
  const stopLogging = BaseError.logProcess()
  const error = new BaseError('test')
  await createProcessError(error)
  t.is(consoleError.args[0][0], error)
  stopLogging()
  consoleError.restore()
})

test.serial('Handles process errors', async (t) => {
  const onError = spy()
  const stopLogging = BaseError.logProcess({ onError })
  const error = new BaseError('test')
  await createProcessError(error)
  t.deepEqual(onError.args, [[error, 'warning']])
  stopLogging()
})

each(
  [
    { error: 'test', message: 'Warning: test' },
    { error: new Error('test'), message: 'test' },
    { error: new TypeError('test'), message: 'test' },
    {
      // eslint-disable-next-line fp/no-mutating-assign
      error: Object.assign(new Error('test'), { name: 'NamedError' }),
      message: 'NamedError: test',
    },
    {
      error: new UnknownError('test'),
      message: 'test',
      expectedConstructor: UnknownError,
    },
    { error: new Error('test'), message: 'test', ErrorClass: UnknownError },
    {
      error: new SiblingError('test'),
      message: 'SiblingError: test',
      ErrorClass: UnknownError,
    },
    {
      error: new UnknownError('test'),
      message: 'test',
      ErrorClass: UnknownError,
    },
  ],
  (
    { title },
    {
      error,
      message,
      ErrorClass = BaseError,
      expectedConstructor = ErrorClass,
    },
  ) => {
    test.serial(
      `Process errors are normalized to ErrorClass | ${title}`,
      async (t) => {
        const onError = spy()
        const stopLogging = ErrorClass.logProcess({ onError })
        await createProcessError(error)
        t.is(onError.args[0][0].constructor, expectedConstructor)
        t.is(onError.args[0][0].message, message)
        stopLogging()
      },
    )
  },
)
