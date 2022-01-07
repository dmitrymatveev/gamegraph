import express from 'express';
import { IRequestGrip, IResponseGrip, ServeGrip } from '@fanoutio/serve-grip';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { Container } from 'brandi';
import { buildSchemaFromProviders } from './modules';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
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

const PORT = process.env.PORT || 8080;

export const start = (options: Options) => {
  const { 
    renderDocs,
    controlUrl,
    schemaProviders
  } = options;

  const schema = buildSchemaFromProviders(schemaProviders);
  const app = express();
  const serveGrip = new ServeGrip({
    grip: {
      control_uri: controlUrl
    },
    gripProxyRequired: false,
  });

  app.use(express.json());
  app.use(serveGrip);

  if (renderDocs) {
    app.use('/docs', voyagerMiddleware({ endpointUrl: '/' }));
  }

  app.use('/', async (req, res) => {
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

  return app.listen(PORT, () =>
    console.log(`Running a GraphQL API server at http://localhost:${PORT}`)
  );
};
