"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsMiddleware = void 0;
const middleware_1 = require("graphql-voyager/middleware");
const docsMiddleware = () => (0, middleware_1.express)({ endpointUrl: '/' });
exports.docsMiddleware = docsMiddleware;
