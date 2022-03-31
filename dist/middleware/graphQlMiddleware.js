"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphQlMiddleware = void 0;
const graphql_helix_1 = require("graphql-helix");
const graphQlMiddleware = (options) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { serveGrip, schema, renderDocs, createRequestContext } = options;
        // Run the middleware
        if (!(yield serveGrip.run(req, res))) {
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
        if (renderDocs && (0, graphql_helix_1.shouldRenderGraphiQL)(request)) {
            res.send((0, graphql_helix_1.renderGraphiQL)());
            return;
        }
        const { operationName, query, variables } = (0, graphql_helix_1.getGraphQLParameters)(request);
        const result = yield (0, graphql_helix_1.processRequest)({
            operationName,
            query,
            variables,
            request,
            schema,
            contextFactory: createRequestContext,
        });
        (0, graphql_helix_1.sendResult)(result, res);
    });
};
exports.graphQlMiddleware = graphQlMiddleware;
