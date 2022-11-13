import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from 'modern-errors'
import modernErrorsProcess, { Options, Event } from 'modern-errors-process'

const BaseError = modernErrors([modernErrorsProcess])
const undo = BaseError.logProcess()

modernErrors([modernErrorsProcess], { process: {} })
BaseError.logProcess({})
expectAssignable<Options>({})
modernErrors([modernErrorsProcess], { process: { exit: true } })
BaseError.logProcess({ exit: true })
expectAssignable<Options>({ exit: true })
expectError(BaseError.logProcess(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([modernErrorsProcess], { process: true }))
expectError(BaseError.logProcess(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([modernErrorsProcess], { process: { exit: 'true' } }))
expectError(BaseError.logProcess({ exit: 'true' }))
expectNotAssignable<Options>({ exit: 'true' })
expectError(modernErrors([modernErrorsProcess], { process: { unknown: true } }))
expectError(BaseError.logProcess({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

expectAssignable<Event>('rejectionHandled')
expectNotAssignable<Event>('')

expectType<void>(undo())
expectError(undo(undefined))
