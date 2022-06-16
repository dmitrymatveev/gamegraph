"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serve_grip_1 = require("@fanoutio/serve-grip");
const graphQlMiddleware_1 = require("./middleware/graphQlMiddleware");
const modules_1 = require("./modules");
const start = (options) => {
    const { port = 8080, controlUrl = 'http://localhost:5561', schemaProviders, } = options;
    const schema = (0, modules_1.createSchemaFromApplicationContext)(schemaProviders);
    const app = (0, express_1.default)();
    const serveGrip = new serve_grip_1.ServeGrip({
        grip: {
            control_uri: controlUrl,
        },
        gripProxyRequired: false,
    });
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(serveGrip);
    app.use('/', (0, graphQlMiddleware_1.graphQlMiddleware)(Object.assign({ schema, serveGrip }, options)));
    return app.listen(port, () => console.log(`Running a GraphQL API server at http://localhost:${port}`));
};
exports.start = start;
