/// <reference types="node" />
import { IRequestGrip, IResponseGrip } from '@fanoutio/serve-grip';
import { Options } from './options';
declare global {
    namespace Express {
        interface Request {
            grip: IRequestGrip;
        }
        interface Response {
            grip: IResponseGrip;
        }
    }
}
export declare const start: <TContext>(options: Options<TContext>) => import("http").Server;
