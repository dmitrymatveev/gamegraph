import express from 'express';
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const PORT = process.env.PORT || 8080;

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

export const start = () => {
  var app = express();
  app.use(
    '/',
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    })
  );
  app.listen(PORT);
  console.log(`Running a GraphQL API server at http://localhost:${PORT}`);
  return app;
};
