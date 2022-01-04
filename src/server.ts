import express, { RequestHandler } from 'express';
import {
  IRequestGrip,
  IResponseGrip,
  ServeGrip
} from '@fanoutio/serve-grip';
import { buildSchema, execute, subscribe } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from 'graphql-helix';

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

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
  
  type Subscription {
    greetings: String
  }
`);

const resolvers = {
  Query: {
    hello: () => {
      console.log('PROCESS QUERY');
      return 'Hello World!';
    },
  },
  Subscription: {
    greetings: {
      subscribe: async function* greeter() {
        console.log('PROCESS SUBSCRIPTION');
        for (const hi of [
          'Hi',
          'Bonjour',
          'Hola',
          'Ciao',
          'Zdravo',
          'Privet',
        ]) {
          yield { greetings: hi };
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const print = (obj:object) => JSON.stringify(obj, null, 2);

export const start = () => {
  const app = express();
  const serveGrip = new ServeGrip({
    grip: {
      control_uri: 'localhost:5561', // Publishing endpoint
    },
    gripProxyRequired: false,
  });

  app.use(express.json());
  app.use(serveGrip);

  app.use(async (req, res) => {
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

    console.log(`
      GRIP: ${print(req.grip)}
    `);

    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      console.log(`
        QUERY: ${print({ operationName, query, variables })}
      `);

      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema: executableSchema,
        // contextFactory: () => ({
        //   // session: req.session,
        // }),
      });

      sendResult(result, res);
      console.log('END')
    }
  });

  app.listen(PORT, () =>
    console.log(`Running a GraphQL API server at http://localhost:${PORT}`)
  );
  return app;
};
