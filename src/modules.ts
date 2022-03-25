import { mergeDeepRight, forEach, clone } from 'ramda';
import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import { GraphQLSchema } from 'graphql';
import {
  ApplicationFactory,
  ApplicationSchemaBuilder,
  ExtendedDefaultContext,
} from './types';

type BuilderOptions<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> =
  PothosSchemaTypes.SchemaBuilderOptions<
    PothosSchemaTypes.ExtendDefaultTypes<T>
  >;

// Shortcut type for pothos options with custom types.
type SchemaOptions<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> =
  PothosSchemaTypes.BuildSchemaOptions<ExtendedDefaultContext<T>>;

const addPlugins = <T>(options?: BuilderOptions<T>) =>
  mergeDeepRight(options ?? {}, {
    plugins: [DataloaderPlugin],
  }) as any as BuilderOptions<T>;

const createSchemaBuilder = <T>(options: BuilderOptions<T>) =>
  new SchemaBuilder<T>(options) as any as ApplicationSchemaBuilder<T>;

const attachSchemaProviders = <T>(
  builder: ApplicationSchemaBuilder<T>,
  providers: ApplicationFactory<T>[]
) => {
  forEach<ApplicationFactory<T>>(
    (addProvider) => addProvider(builder),
    providers
  );
  return builder;
};

const applySchema = <T, U>(
  builder: ApplicationSchemaBuilder<T>,
  options?: SchemaOptions<U>
) => builder.toSchema(clone(options || ({} as SchemaOptions<U>)));

/**
 * Creates graphQl schema from given providers.
 * @param schemaProviders List of application factories
 * @param builderOptions initial context instance
 * @param schemaOptions schema options
 * @returns generated graphQl schema
 */
export const createSchemaFromApplicationContext = <T>(
  schemaProviders: ApplicationFactory<T>[],
  builderOptions?: BuilderOptions<T>,
  schemaOptions?: SchemaOptions<T>
): GraphQLSchema => {
  const customPlugins = addPlugins(builderOptions);
  const builder = createSchemaBuilder(customPlugins);
  attachSchemaProviders(builder, schemaProviders);
  const schema = applySchema(builder, schemaOptions);
  return schema;
};
