import { ServeGrip } from '@fanoutio/serve-grip';
import { RequestHandler } from 'express';
import { GraphQLSchema } from 'graphql';
import { Options } from '../options';
export declare type GraphQlMiddlewareOptions<TContext> = Options<TContext> & {
    serveGrip: ServeGrip;
    schema: GraphQLSchema;
};
export declare const graphQlMiddleware: <TContext>(context: GraphQlMiddlewareOptions<TContext>) => RequestHandler;
