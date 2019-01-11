import * as Koa from "koa";
import KoaSSE from "./sse";
import { Context } from "koa";
import { IKoaSSE } from "./interfaces/IKoaSSEE";
import { IKoaSSEOptions } from "./interfaces/IKoaSSEOptions";
import { Writable } from "stream";

declare module "koa" {
    interface Context {
        sse: IKoaSSE;
    }
    interface Response extends Koa.BaseResponse {
        sse: IKoaSSE;
    }
}

const defaultOptions: IKoaSSEOptions = { 
    pingInterval: 60000,
    closeEvent: "close" 
};

/**
 * Koa Server Side Events middleware
 *
 * @param {IKoaSSEOptions} [options=defaultOptions]
 * @returns
 */
const middleware = (options: IKoaSSEOptions = defaultOptions) => {

    return async (ctx: Context, next: () => Promise<void>) => {

        if (ctx.res.headersSent) {
            if (!ctx.sse) {
                console.error('[koa-sse]: response headers already sent, unable to create sse stream');
            }
            return await next();
        }

        const sse = new KoaSSE(ctx, options);

        sse.on("finish", () => ctx.res.end());

        ctx.sse = ctx.response.sse = sse;

        await next();

        if (!ctx.body) {
            // Set response to sse stream if no body
            ctx.body = ctx.sse;
        } else if (ctx.body instanceof Writable) {
            // Stream body into sse writable stream exists
            ctx.body = ctx.body.pipe(ctx.sse);
        } else {
            // Empty existing body response into sse stream
            ctx.sse.send(ctx.body);
            ctx.body = sse;
        }
    };
};

export default middleware;