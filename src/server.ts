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
  const { port = 8080, renderDocs, controlUrl, schemaProviders } = options;

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

  app.use('/', graphQlResponse({ schema, serveGrip, ...options }));

  renderDocs && app.use('/docs', voyagerMiddleware({ endpointUrl: '/' }));

  return app.listen(port, () =>
    console.log(`Running a GraphQL API server at http://localhost:${port}`)
  );
};
