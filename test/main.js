import { emitWarning } from 'node:process'
import { promisify } from 'node:util'

import test from 'ava'
import modernErrors from 'modern-errors'
import modernErrorsProcess from 'modern-errors-process'
import sinon from 'sinon'
import { each } from 'test-each'

// TODO: use `timers/promises` after dropping support for Node <15
const pSetInterval = promisify(setInterval)

const BaseError = modernErrors([modernErrorsProcess])
const UnknownError = BaseError.subclass('UnknownError')
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')
const TestError = BaseError.subclass('TestError')

each(
  [true, { unknown: true }, { exit: 'true' }, { onError: true }],
  ({ title }, options) => {
    test.serial(`Options are validated | ${title}`, (t) => {
      t.throws(BaseError.logProcess.bind(BaseError, options))
    })
  },
)

const createProcessError = async function (error) {
  emitWarning(error)
  await pSetInterval()
}

test.serial('Prints on the console by default', async (t) => {
  // eslint-disable-next-line no-restricted-globals
  const consoleError = sinon.stub(console, 'error')
  const stopLogging = BaseError.logProcess()
  const error = new UnknownError('test')
  await createProcessError(error)
  t.is(consoleError.args[0][0], error)
  stopLogging()
  consoleError.restore()
})

test.serial('Handles process errors', async (t) => {
  const onError = sinon.spy()
  const stopLogging = BaseError.logProcess({ onError })
  const error = new UnknownError('test')
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
    { error: new UnknownError('test'), message: 'test' },
    { error: new ChildUnknownError('test'), message: 'test' },
    { error: new TestError('test'), message: 'TestError: test' },
  ],
  ({ title }, { error, message }) => {
    test.serial(
      `Process errors are normalized to UnknownError | ${title}`,
      async (t) => {
        const onError = sinon.spy()
        const stopLogging = BaseError.logProcess({ onError })
        await createProcessError(error)
        t.true(onError.args[0][0] instanceof UnknownError)
        t.is(onError.args[0][0].message, message)
        stopLogging()
      },
    )
  },
)
