import { Context } from "koa";
import KoaSSE from "./sse";


const DEFAULT_OPTS = {
    pingInterval: 60000,
    closeEvent: "close"
};

const middleware = (opts = {}) => {

    opts = Object.assign({}, DEFAULT_OPTS, opts);

    return async (ctx: Context, next: () => Promise<void>) => {

        const sse = new KoaSSE(ctx);
        sse.on("finish", () => ctx.res.end());

        ctx.response.socket.

        ctx.sse = ctx.res.sse = sse;

        await next();
    };
};

export default middleware;