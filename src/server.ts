import express from 'express';
import {
  IRequestGrip,
  IResponseGrip,
  ServeGrip,
} from '@fanoutio/serve-grip';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { Container } from 'brandi';
import { buildSchemaFromProviders, SchemaProvider } from './modules';
import { altairExpress } from 'altair-express-middleware';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { webSocketHandler } from './handlers/ws';
import { WebSocketMessageFormat } from '@fanoutio/grip';

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


const PORT = process.env.PORT || 8080;

export const start = (schemaProviders: SchemaProvider[]) => {
  const schema = buildSchemaFromProviders(schemaProviders);
  const app = express();
  const gripServe = new ServeGrip({
    grip: {
      control_uri: 'http://localhost:5561/', // Publishing endpoint
    },
    gripProxyRequired: false,
  });

  app.use(express.json());
  app.use(gripServe);

  app.use('/altair', altairExpress({
    endpointURL: '/',
    subscriptionsEndpoint: 'ws:localhost:7999',
    initialQuery: '{ hello }',
  }));
  
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/' }));

  app.use('/subscriptions', webSocketHandler({ gripServe, schema }));

  
  app.post('/api/broadcast', express.text({ type: '*/*' }), async (req, res) => {

    const publisher = gripServe.getPublisher();
    await publisher.publishFormats('test', new WebSocketMessageFormat(req.body));

    res.setHeader('Content-Type', 'text/plain');
    res.end('Ok\n');

  });

  app.use(async (req, res) => {
    // Run the middleware
    if (!(await gripServe.run(req, res))) {
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

    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => new Container(),
      });

      sendResult(result, res);
    }
  });

  app.listen(PORT, () =>
    console.log(`Running a GraphQL API server at http://localhost:${PORT}`)
  );
  return app;
};
