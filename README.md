<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors-process)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/modern-errors-process)
[![Twitter](https://img.shields.io/badge/-Twitter-808080.svg?logo=twitter&colorA=404040)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

[`modern-errors`](https://github.com/ehmicky/modern-errors)
[plugin](https://github.com/ehmicky/modern-errors#-plugins) to handle process
errors.

This improves process errors:
[uncaught](https://nodejs.org/api/process.html#process_event_uncaughtexception)
exceptions,
[unhandled](https://nodejs.org/api/process.html#process_event_unhandledrejection)
promises, promises
[handled too late](https://nodejs.org/api/process.html#process_event_rejectionhandled)
and [warnings](https://nodejs.org/api/process.html#process_event_warning).

# Features

- Stack traces for warnings and
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
- [Single event handler](#onerror) for all process errors
- Set any process error's class to
  [`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#-unknown-errors)
- Ignore [duplicate](#onerror) process errors
- [Normalize](#error) invalid errors
- [Process exit](#exit) is graceful and can be prevented

# Example

[Adding the plugin](https://github.com/ehmicky/modern-errors#adding-plugins) to
[`modern-errors`](https://github.com/ehmicky/modern-errors).

```js
import ModernError from 'modern-errors'
import modernErrorsProcess from 'modern-errors-process'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsProcess],
})
// ...
```

[Initializing](#baseerrorlogprocess) the process error handler.

```js
BaseError.logProcess()
```

# Install

Production code (e.g. a server) can install this either as a production or as a
development dependency.

```bash
npm install modern-errors-process
```

However, libraries should install this as a development dependency.

```bash
npm install -D modern-errors-process
```

This is because logging is modified globally and libraries users might not
expect this side-effect. Also, this might lead to conflicts between libraries.

This package requires Node.js >=14.18.0. It is an ES module and must be loaded
using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrorsProcess

_Type_: `Plugin`

Plugin object to pass to the
[`plugins` option](https://github.com/ehmicky/modern-errors#adding-plugins) of
`ErrorClass.subclass()`.

## BaseError.logProcess()

_Return value_: `() => void`

Start handling process errors.

The return value restores Node.js default behavior.

```js
const restore = BaseError.logProcess()
restore()
```

## Options

_Type_: `object`

Options must be passed either to
[`ModernError.subclass()`](https://github.com/ehmicky/modern-errors#options-1).

```js
export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsProcess],
  process: options,
})
```

Or to [`BaseError.logProcess()`](#baseerrorlogprocess).

```js
BaseError.logProcess(...args, options)
```

### exit

_Type_: `boolean`

Whether to exit the process on
[uncaught exceptions](https://nodejs.org/api/process.html#process_event_uncaughtexception)
or
[unhandled promises](https://nodejs.org/api/process.html#process_event_unhandledrejection).

This is `false` by default if other libraries are listening to those events, so
they can perform the exit instead. Otherwise, this is `true`.

If some tasks are still ongoing, the exit waits for them to complete up to 3
seconds.

### onError

_Type_: `(error, event) => Promise<void> | void`\
_Default_: `console.error(error)`

Function called once per process error. Duplicate process errors are ignored.

#### error

_Type_:
[`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#-unknown-errors)

The process error. This is guaranteed to be a
[normalized](https://github.com/ehmicky/normalize-exception)
[`UnknownError`](https://github.com/ehmicky/modern-errors/README.md#-unknown-errors)
instance. A short description of the [event](#event) is also appended to its
message.

#### event

_Type_: `Event`

Process event name among:
[`'uncaughtException'`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`'unhandledRejection'`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`'rejectionHandled'`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`'warning'`](https://nodejs.org/api/process.html#process_event_warning).

# Related projects

- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors
- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2022 🔮
- [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli): Handle
  errors in CLI modules
- [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs): Print
  where to report bugs
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`modern-errors-clean`](https://github.com/ehmicky/modern-errors-clean): Clean
  stack traces
- [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http): Create
  HTTP error responses
- [`modern-errors-winston`](https://github.com/ehmicky/modern-errors-winston):
  Log errors with Winston

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors-process/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors-process/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
