import express from 'express';
import cors from 'cors';
import { IRequestGrip, IResponseGrip, ServeGrip } from '@fanoutio/serve-grip';
import { Options } from './options';
import { graphQlMiddleware } from './middleware/graphQlMiddleware';
import { createSchemaFromApplicationContext } from './modules';
import { ExtendedDefaultContext } from '.';

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

export const start = <TContext extends ExtendedDefaultContext<any>>(options: Options<TContext>) => {
  const {
    port = 8080,
    controlUrl = 'http://localhost:5561',
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

  app.use(cors());

  app.use(express.json());

  app.use(serveGrip);

  app.use('/', graphQlMiddleware<TContext>({ schema, serveGrip, ...options }));

  return app.listen(port, () =>
    console.log(`Running a GraphQL API server at http://localhost:${port}`)
  );
};
