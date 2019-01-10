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
