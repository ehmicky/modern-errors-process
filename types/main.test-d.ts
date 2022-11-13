import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import ModernError from 'modern-errors'
import modernErrorsProcess, { Options, Event } from 'modern-errors-process'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsProcess],
})
const undo = BaseError.logProcess()

ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  process: {},
})
BaseError.logProcess({})
expectAssignable<Options>({})
ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  process: { exit: true },
})
BaseError.logProcess({ exit: true })
expectAssignable<Options>({ exit: true })
expectError(BaseError.logProcess(undefined))
expectNotAssignable<Options>(undefined)
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: true,
  }),
)
expectError(BaseError.logProcess(true))
expectNotAssignable<Options>(true)
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: { exit: 'true' },
  }),
)
expectError(BaseError.logProcess({ exit: 'true' }))
expectNotAssignable<Options>({ exit: 'true' })
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: { unknown: true },
  }),
)
expectError(BaseError.logProcess({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

expectAssignable<Event>('rejectionHandled')
expectNotAssignable<Event>('')

expectType<void>(undo())
expectError(undo(undefined))
