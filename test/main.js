import { emitWarning } from 'node:process'
import { promisify } from 'node:util'

import test from 'ava'
import ModernError from 'modern-errors'
import modernErrorsProcess from 'modern-errors-process'
import sinon from 'sinon'
import { each } from 'test-each'

// TODO: use `timers/promises` after dropping support for Node <15
const pSetInterval = promisify(setInterval)

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsProcess],
})
const UnknownError = BaseError.subclass('UnknownError')
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')
const TestError = BaseError.subclass('TestError')

each(
  [
    true,
    { unknown: true },
    { exit: 'true' },
    { onError: true },
    { UnknownError: true },
    { UnknownError: Error },
    { UnknownError: ModernError },
  ],
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
  const error = new BaseError('test')
  await createProcessError(error)
  t.is(consoleError.args[0][0], error)
  stopLogging()
  consoleError.restore()
})

test.serial('Handles process errors', async (t) => {
  const onError = sinon.spy()
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
    {
      error: new Error('test'),
      message: 'test',
      passUnknown: false,
      expectedConstructor: BaseError,
    },
    { error: new TypeError('test'), message: 'test' },
    {
      // eslint-disable-next-line fp/no-mutating-assign
      error: Object.assign(new Error('test'), { name: 'NamedError' }),
      message: 'NamedError: test',
    },
    { error: new UnknownError('test'), message: 'test' },
    { error: new UnknownError('test'), message: 'test', passUnknown: false },
    {
      error: new ChildUnknownError('test'),
      message: 'test',
      expectedConstructor: ChildUnknownError,
    },
    {
      error: new ChildUnknownError('test'),
      message: 'test',
      passUnknown: false,
      expectedConstructor: ChildUnknownError,
    },
    { error: new TestError('test'), message: 'TestError: test' },
    {
      error: new TestError('test'),
      message: 'test',
      passUnknown: false,
      expectedConstructor: TestError,
    },
  ],
  (
    { title },
    { error, message, passUnknown = true, expectedConstructor = UnknownError },
  ) => {
    test.serial(
      `Process errors are normalized to UnknownError | ${title}`,
      async (t) => {
        const onError = sinon.spy()
        const UnknownErrorOpt = passUnknown ? UnknownError : undefined
        const stopLogging = BaseError.logProcess({
          onError,
          UnknownError: UnknownErrorOpt,
        })
        await createProcessError(error)
        t.is(onError.args[0][0].constructor, expectedConstructor)
        t.is(onError.args[0][0].message, message)
        stopLogging()
      },
    )
  },
)
