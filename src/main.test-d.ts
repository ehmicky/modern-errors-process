import ModernError from 'modern-errors'
import modernErrorsProcess, {
  type Options,
  type Event as ProcessEvent,
} from 'modern-errors-process'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'


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
// @ts-expect-error
UnknownError.logProcess(undefined)
expectNotAssignable<Options>(undefined)
ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  // @ts-expect-error
  process: true,
})
// @ts-expect-error
UnknownError.logProcess(true)
expectNotAssignable<Options>(true)
ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  // @ts-expect-error
  process: { exit: 'true' },
})

// @ts-expect-error
UnknownError.logProcess({ exit: 'true' })
expectNotAssignable<Options>({ exit: 'true' })
ModernError.subclass('TestError', {
  plugins: [modernErrorsProcess],
  // @ts-expect-error
  process: { unknown: true },
})
// @ts-expect-error
UnknownError.logProcess({ unknown: true })
expectNotAssignable<Options>({ unknown: true })

expectAssignable<ProcessEvent>('rejectionHandled')
expectNotAssignable<ProcessEvent>('')

expectType<void>(undo())
// @ts-expect-error
undo(undefined)
