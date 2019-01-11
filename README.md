# koa-event-stream

![Language](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Node Version](https://img.shields.io/badge/node-v.10.15.0-blue.svg)
![Yarn Version](https://img.shields.io/badge/yarn-v1.12.3-yellow.svg)
![Licence Info](https://img.shields.io/badge/license-MIT-brightgreen.svg)

<a href="https://communityinviter.com/apps/koa-js/koajs" rel="KoaJs Slack Community">![KoaJs Slack](https://img.shields.io/badge/Koa.Js-Slack%20Channel-Slack.svg?longCache=true&style=for-the-badge)</a>

Koa.js middleware to stream events (using Server Sent Events) to clients without WebSockets.

* 🎉 First class Typescript support
* 📡 Realtime events over plain HTTP
* 💡 Serve as a REST endpoint route
* ☁️ Stateless by design
* 👌 Simple unopinionated API


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Support](#support)
- [Contributing](#contributing)
- [Licence](#licence)
- [Author](#author)

## Installation

```bash
$ npm install --save koa-event-stream

...
```
```bash
$ yarn add koa-event-stream

...
```

## Usage

```typescript
import * as Koa from "koa";
import KoaSSE from "../../src/index";

const app = new Koa();

app.use(KoaSSE());

app.use(async (ctx: Koa.Context) => {
    let n = 0;
    const interval = setInterval(() => {
        ctx.sse.send(new Date().toString());
        n++;
        if (n >= 5) {
            ctx.sse.end();
            clearInterval(interval);
        }
    }, 1000);
    ctx.sse.on("finish", () => clearInterval(interval));
});

app.listen(5000);
```

#### ctx.sse.send(data)

```ts
ctx.sse.send(data)
```

#### ctx.sse.end()

```ts
ctx.sse.end()
```

## Examples

TBC

## Support

Please [open an issue](https://github.com/jarvisprestidge/koa-event-stream/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/jarvisprestidge/koa-event-stream/compare/).

## License

**MIT** : http://opensource.org/licenses/MIT

## Author

**Jarvis Prestidge** | <jarvisprestidge@gmail.com>
