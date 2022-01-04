import express, { RequestHandler } from "express";
import { buildSchema, execute, subscribe } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { 
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,  
} from 'graphql-helix';

// TODO: add GRIP handling https://github.com/fanout/js-serve-grip, replace sendResult function
// TODO: add datalayer caching https://github.com/graphql/dataloader
// TODO: use graphQl modules https://www.graphql-modules.com/ type-safety, cqrs, testability
// TODO: add permissions to graph https://github.com/maticzav/graphql-shield
// TODO: investigate graphQl integration QA https://graphql-inspector.com/

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
      console.log('PROCESS QUERY')
      return 'Hello World!'
    },
  },
  Subscription: {
    greetings: {
      subscribe: async function * greeter() {
        console.log('PROCESS SUBSCRIPTION')
        for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo', 'Privet']) {
          yield { greetings: hi }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export const start = () => {
  const app = express();
  
  app.use(express.json());

  app.use("/", async (req, res) => {

    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };
    
    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    }
    else {
      const { operationName, query, variables } = getGraphQLParameters(request);
  
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
    }
  });

  app.listen(PORT, () => console.log(`Running a GraphQL API server at http://localhost:${PORT}`));
  return app;
};
