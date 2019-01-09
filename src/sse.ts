import { Context } from "koa";
import { IKoaSSEOptions } from "./interfaces/IKoaSSEOptions";
import { IKoaSSEvent } from "./interfaces/IKoaSSEEvent";
import { Transform } from "stream";

const defaultOptions: IKoaSSEOptions = { 
    pingInterval: 30,
    closeEvent: "close" 
};

/**
 * Koa Server Side Events Middleware
 *
 * @class KoaSSE
 */
class KoaSSE extends Transform {

    private interval!: NodeJS.Timeout;
    private readonly ctx: Context;
    private readonly options: IKoaSSEOptions;

    /**
     * Creates an instance of KoaSSE.
     *
     * @param {Context} ctx
     * @param {IKoaSSEOptions} options
     */
    constructor(ctx: Context, options: IKoaSSEOptions = defaultOptions) {

        super({
            writableObjectMode: true
        });

        this.options = options;
        this.ctx = ctx;

        ctx.set("Content-Type", "text/event-stream");
        ctx.set("Cache-Control", "no-cache, no-transform");
        ctx.set("Connection", "keep-alive");

        this.keepAlive();
    }

    /**
     * Send server side event
     *
     * @param {(IKoaSSEvent | string)} data
     */
    public send(data: IKoaSSEvent | string) {
        this.write(data)
    }

    /**
     * Send "heartbeat" comment to keep connection alive
     * 
     */
    public keepAlive() {
        this.interval = setInterval(() => {
            this.push(":\n\n");
            console.log(`${new Date}: SSE heartbeat ping...`);
        }, this.options.pingInterval);
    }

    /**
     * Send close event source message and end stream
     *
     */
    public close() {
        const data: IKoaSSEvent = { 
            event: this.options.closeEvent 
        };
        clearInterval(this.interval);
        this.send(data);
        this.end();
    }

    /**
     * Transform stream base class method
     *
     * @param {(IKoaSSEvent | string)} data
     * @returns
     */
    public _transform(data: IKoaSSEvent | string) {

        // Handle string data 
        if (typeof data === "string") {
            this.push(`data: ${data}\n\n`);
            return;
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
    }
}

export default KoaSSE;
