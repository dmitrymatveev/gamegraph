import express from 'express';
import { IRequestGrip, IResponseGrip, ServeGrip } from '@fanoutio/serve-grip';
import { buildSchemaFromProviders } from './modules';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { Options } from './options';
import { graphQlResponse } from './middleware/graphQlResponse';

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

export const start = (options: Options) => {
  const {
    port = 8080,
    controlUrl = 'http://localhost:5561',
    renderDocs,
    schemaProviders,
  } = options;

  const schema = buildSchemaFromProviders(schemaProviders);
  const app = express();
  const serveGrip = new ServeGrip({
    grip: {
      control_uri: controlUrl,
    },
    gripProxyRequired: false,
  });

  app.use(express.json());

  app.use(serveGrip);

  if (renderDocs) {
    app.use('/schema', voyagerMiddleware({ endpointUrl: '/' }));
  }

  app.use('/', graphQlResponse({ schema, serveGrip, ...options }));

  return app.listen(port, () =>
    console.log(`Running a GraphQL API server at http://localhost:${port}`)
  );
};
