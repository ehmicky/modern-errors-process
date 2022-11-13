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
const UnknownError = BaseError.subclass('UnknownError')
const undo = UnknownError.logProcess()

ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  process: {},
})
UnknownError.logProcess({})
expectAssignable<Options>({})
ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  process: { exit: true },
})
UnknownError.logProcess({ exit: true })
expectAssignable<Options>({ exit: true })
expectError(UnknownError.logProcess(undefined))
expectNotAssignable<Options>(undefined)
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: true,
  }),
)
expectError(UnknownError.logProcess(true))
expectNotAssignable<Options>(true)
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: { exit: 'true' },
  }),
)
expectError(UnknownError.logProcess({ exit: 'true' }))
expectNotAssignable<Options>({ exit: 'true' })
expectError(
  ModernError.subclass('TestError', {
    plugins: [modernErrorsProcess],
    process: { unknown: true },
  }),
)
expectError(UnknownError.logProcess({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

expectAssignable<Event>('rejectionHandled')
expectNotAssignable<Event>('')

expectType<void>(undo())
expectError(undo(undefined))
