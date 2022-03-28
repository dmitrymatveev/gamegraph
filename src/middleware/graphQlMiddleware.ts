import { ServeGrip } from '@fanoutio/serve-grip';
import { Container } from 'brandi';
import { RequestHandler } from 'express';
import { GraphQLSchema } from 'graphql';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { Options } from '../options';

export type GraphQlMiddlewareOptions<TContext> = Options<TContext> & {
  serveGrip: ServeGrip;
  schema: GraphQLSchema;
};

export const graphQlMiddleware: <TContext>(
  context: GraphQlMiddlewareOptions<TContext>
) => RequestHandler = (context) => {

  const { registerDependencies } = context;
  const rootContainer = new Container();

  if (registerDependencies) {
    registerDependencies(rootContainer);
  }
  
  return async (req, res) => {
    const { serveGrip, schema, renderDocs } = context;
  
    // Run the middleware
    if (!(await serveGrip.run(req, res))) {
      // If serveGrip.run() has returned false, it means the middleware has already
      // sent and ended the response, usually due to an error.
      return;
    }
  
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };
  
    if (renderDocs && shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
      return;
    }
  
    const { operationName, query, variables } = getGraphQLParameters(request);
  
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => ({
        container: new Container().extend(rootContainer)
      }),
    });
  
    sendResult(result, res);
  };
}
