import { RequestHandler } from 'express';
import { ServeGrip } from '@fanoutio/serve-grip';
import { GraphQLSchema } from 'graphql';

export type GripRequestContext = {
    gripServe: ServeGrip
    schema: GraphQLSchema
}

export type GripRequestHandlerFactory = {
    (context: GripRequestContext): RequestHandler
}