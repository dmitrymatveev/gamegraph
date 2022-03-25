import express from 'express';
import { IRequestGrip, IResponseGrip, ServeGrip } from '@fanoutio/serve-grip';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { Options } from './options';
import { graphQlMiddleware } from './middleware/graphQlMiddleware';
import { createSchemaFromApplicationContext } from './modules';

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

export const start = <TContext>(options: Options<TContext>) => {
  const {
    port = 8080,
    controlUrl = 'http://localhost:5561',
    renderDocs,
    schemaProviders,
  } = options;

  const schema = createSchemaFromApplicationContext<TContext>(schemaProviders);
  
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

  app.use('/', graphQlMiddleware<TContext>({ schema, serveGrip, ...options }));

  return app.listen(port, () =>
    console.log(`Running a GraphQL API server at http://localhost:${port}`)
  );
};
