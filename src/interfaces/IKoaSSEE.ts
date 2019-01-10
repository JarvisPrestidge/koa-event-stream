import { IKoaSSEvent } from "./IKoaSSEEvent";
import { Transform } from "stream";

/**
 * Represents a Koa Server Side Event instance
 *
 * @export
 * @interface IKoaSSE
 */
export interface IKoaSSE extends Transform {
    send(data: IKoaSSEvent | string): void;
    keepAlive(): void;
    close(): void;
}
