import { GraphQLSchema } from 'graphql';
import { ApplicationFactory, ExtendedDefaultContext } from './types';
declare type BuilderOptions<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> = PothosSchemaTypes.SchemaBuilderOptions<PothosSchemaTypes.ExtendDefaultTypes<T>>;
declare type SchemaOptions<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> = PothosSchemaTypes.BuildSchemaOptions<ExtendedDefaultContext<T>>;
/**
 * Creates graphQl schema from given providers.
 * @param schemaProviders List of application factories
 * @param builderOptions initial context instance
 * @param schemaOptions schema options
 * @returns generated graphQl schema
 */
export declare const createSchemaFromApplicationContext: <T>(schemaProviders: ApplicationFactory<T>[], builderOptions?: BuilderOptions<T> | undefined, schemaOptions?: SchemaOptions<T> | undefined) => GraphQLSchema;
export {};
