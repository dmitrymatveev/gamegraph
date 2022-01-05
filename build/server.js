"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const PORT = process.env.PORT || 8080;
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
var root = {
    hello: () => {
        return 'Hello world!';
    },
};
const start = () => {
    var app = (0, express_1.default)();
    app.use('/', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }));
    app.listen(PORT);
    console.log(`Running a GraphQL API server at http://localhost:${PORT}`);
    return app;
};
exports.start = start;
