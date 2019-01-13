import { Context } from "koa";
import { IKoaSSEOptions } from "./interfaces/IKoaSSEOptions";
import { IKoaSSEvent } from "./interfaces/IKoaSSEEvent";
import { IKoaSSE } from "./interfaces/IKoaSSEE";
import { Transform, TransformCallback } from "stream";

/**
 * Koa Server Side Events Middleware
 *
 * @class KoaSSE
 * @extends {Transform}
 * @implements {IKoaSSE}
 */
class KoaSSE extends Transform implements IKoaSSE {

    private readonly options: IKoaSSEOptions;

    /**
     * Creates an instance of KoaSSE.
     *
     * @param {Context} ctx
     * @param {IKoaSSEOptions} options
     */
    constructor(ctx: Context, options: IKoaSSEOptions) {

        super({
            writableObjectMode: true
        });

        this.options = options;

        ctx.req.socket.setTimeout(0);
        ctx.req.socket.setNoDelay(true);
        ctx.req.socket.setKeepAlive(true);

        ctx.set("Content-Type", "text/event-stream");
        ctx.set("Cache-Control", "no-cache, no-transform");
        ctx.set("Connection", "keep-alive");

        this.keepAlive();
    }

    /**
     * Send "heartbeat" comment to keep connection alive
     * 
     */
    public keepAlive() {
        this.push(":\n\n");
    }

    /**
     * Send server side event
     *
     * @param {(IKoaSSEvent | string)} data
     */
    public send(data: IKoaSSEvent | string) {
        try {
            this.write(data)
        } catch (error) {
            console.error("Cannot write to already destroyed stream");
        }
    }

    /**
     * Send close event source message and end stream
     *
     */
    public close() {
        const data: IKoaSSEvent = { 
            event: this.options.closeEvent 
        };
        this.end(data);
    }

    /**
     * Transform stream base class method
     *
     * @param {*} data
     * @param {string} _
     * @param {TransformCallback} __
     * @returns {void}
     */
    public _transform(data: any, _: string, cb: TransformCallback): void {

        // Handle string data 
        if (typeof data === "string") {
            this.push(`data: ${data}\n\n`);
            return cb();
        }

        // Handle object data 
        if (data.id) {
            this.push(`id: ${data.id}\n`);
        }
        if (data.event) {
            this.push(`event: ${data.event}\n`);
        }
        const text = typeof data.data === "object"
            ? JSON.stringify(data.data)
            : data.data;
        this.push(`data: ${text}\n\n`);
        return cb();
    }
}

export default KoaSSE;
