import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from 'modern-errors'
import modernErrorsProcess, { Options, Event } from 'modern-errors-process'

const AnyError = modernErrors([modernErrorsProcess])
const undo = AnyError.logProcess()

modernErrors([modernErrorsProcess], { process: {} })
AnyError.logProcess({})
expectAssignable<Options>({})
modernErrors([modernErrorsProcess], { process: { exit: true } })
AnyError.logProcess({ exit: true })
expectAssignable<Options>({ exit: true })
expectError(AnyError.logProcess(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([modernErrorsProcess], { process: true }))
expectError(AnyError.logProcess(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([modernErrorsProcess], { process: { exit: 'true' } }))
expectError(AnyError.logProcess({ exit: 'true' }))
expectNotAssignable<Options>({ exit: 'true' })
expectError(modernErrors([modernErrorsProcess], { process: { unknown: true } }))
expectError(AnyError.logProcess({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

expectAssignable<Event>('rejectionHandled')
expectNotAssignable<Event>('')

expectType<void>(undo())
expectError(undo(undefined))
