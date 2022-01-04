import express from 'express';
import { createServer } from 'http'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema, execute, subscribe } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

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
    greetings: async function * greeter() {
      console.log('PROCESS SUBSCRIPTION')
      for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
        yield { greetings: hi }
      }
    }
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})

// const schema = makeExecutableSchema({
//   typeDefs: typeDefs,
//   resolvers: resolvers,
// });

export const start = () => {
  var app = express();
  app.use(
    '/',
    graphqlHTTP({
      schema: executableSchema,
      graphiql: true,
    })
  );
  app.listen(PORT);
  console.log(`Running a GraphQL API server at http://localhost:${PORT}`);
  return app;
};
