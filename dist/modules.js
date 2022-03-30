"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaFromApplicationContext = void 0;
const ramda_1 = require("ramda");
const core_1 = __importDefault(require("@pothos/core"));
const plugin_dataloader_1 = __importDefault(require("@pothos/plugin-dataloader"));
const addPlugins = (options) => (0, ramda_1.mergeDeepRight)(options !== null && options !== void 0 ? options : {}, {
    plugins: [plugin_dataloader_1.default],
});
const createSchemaBuilder = (options) => new core_1.default(options);
const attachSchemaProviders = (builder, providers) => {
    (0, ramda_1.forEach)((addProvider) => addProvider(builder), providers);
    return builder;
};
const applySchema = (builder, options) => builder.toSchema((0, ramda_1.clone)(options || {}));
/**
 * Creates graphQl schema from given providers.
 * @param schemaProviders List of application factories
 * @param builderOptions initial context instance
 * @param schemaOptions schema options
 * @returns generated graphQl schema
 */
const createSchemaFromApplicationContext = (schemaProviders, builderOptions, schemaOptions) => {
    const customPlugins = addPlugins(builderOptions);
    const builder = createSchemaBuilder(customPlugins);
    attachSchemaProviders(builder, schemaProviders);
    const schema = applySchema(builder, schemaOptions);
    return schema;
};
exports.createSchemaFromApplicationContext = createSchemaFromApplicationContext;
