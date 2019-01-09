/**
 * Represents a Koa server side event
 *
 * @export
 * @interface IKoaSSEvent
 */
export interface IKoaSSEvent {
    id?: number;
    data?: string | object;
    event?: string;
}
