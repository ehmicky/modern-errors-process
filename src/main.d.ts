import type logProcessErrors from 'log-process-errors'
import type { Event as ProcessEvent, Options } from 'log-process-errors'
import type { Info } from 'modern-errors'

export type { ProcessEvent as Event }

/**
 * Options of `modern-errors-process`
 */
export type { Options }

/**
 * `modern-errors-process` plugin (Node.js only)
 */
declare const plugin: {
  name: 'process'
  getOptions: (input: Options) => Options
  staticMethods: {
    /**
     * Improves process errors:
     * [uncaught](https://nodejs.org/api/process.html#process_event_uncaughtexception)
     * exceptions,
     * [unhandled](https://nodejs.org/api/process.html#process_event_unhandledrejection)
     * promises, promises
     * [handled too late](https://nodejs.org/api/process.html#process_event_rejectionhandled)
     * and [warnings](https://nodejs.org/api/process.html#process_event_warning).
     *
     * It returns a function to restore Node.js default behavior.
     *
     * @example
     * ```js
     * const restore = UnknownError.logProcess()
     * restore()
     * ```
     */
    logProcess: (
      info: Info['staticMethods'],
    ) => ReturnType<typeof logProcessErrors>
  }
}
export default plugin
