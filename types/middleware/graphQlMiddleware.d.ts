import { ServeGrip } from '@fanoutio/serve-grip';
import { RequestHandler } from 'express';
import { GraphQLSchema } from 'graphql';
import { Options } from '../options';
import { ExtendedDefaultContext } from '../types';
export declare type GraphQlMiddlewareOptions<TContext extends ExtendedDefaultContext<any>> = Options<TContext> & {
    serveGrip: ServeGrip;
    schema: GraphQLSchema;
};
export declare const graphQlMiddleware: <TContext extends ExtendedDefaultContext<any>>(context: GraphQlMiddlewareOptions<TContext>) => RequestHandler;
