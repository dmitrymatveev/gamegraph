import SchemaBuilder from '@pothos/core';
import { GraphQLSchema } from 'graphql';
import { ApplicationContext } from './context';

export type Scalar<TInput, TOutput> = { Input: TInput; Output: TOutput };

// Consumer extended default types, wrapps custom types of T.
export type ExtendedDefaultContext<
  T extends Partial<PothosSchemaTypes.UserSchemaTypes>
> = PothosSchemaTypes.ExtendDefaultTypes<ApplicationContext & T>;

// Shortcut type for pothos schema builder with custom schema types.
export type ApplicationSchemaBuilder<
  T extends Partial<PothosSchemaTypes.UserSchemaTypes>
> = PothosSchemaTypes.SchemaBuilder<ExtendedDefaultContext<T>>;
// Shortcut type for pothos options with custom types.
type Options<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> =
  PothosSchemaTypes.BuildSchemaOptions<ExtendedDefaultContext<T>>;

/**
 * Convenience application entry point callback.
 */
export type ApplicationFactory<
  T extends Partial<PothosSchemaTypes.UserSchemaTypes>
> = (builder: ApplicationSchemaBuilder<T>) => void;

/**
 * Convenience subscription schema factory
 */
export type SubscriptionBuilder<
  T extends Partial<PothosSchemaTypes.UserSchemaTypes>
> = PothosSchemaTypes.SubscriptionFieldBuilder<
  ExtendedDefaultContext<T>,
  object & {}
>;

/**
 * Convenience query schema factory
 */
export type QueryBuilder<T extends Partial<PothosSchemaTypes.UserSchemaTypes>> =
  PothosSchemaTypes.QueryFieldBuilder<ExtendedDefaultContext<T>, object & {}>;

/**
 * Convenience mutation schema factory
 */
export type MutationBuilder<
  T extends Partial<PothosSchemaTypes.UserSchemaTypes>
> = PothosSchemaTypes.MutationFieldBuilder<
  ExtendedDefaultContext<T>,
  object & {}
>;

/**
 * Creates graphQl schema from given providers.
 * @param providers List of application factories
 * @param state initial context instance
 * @param options pothos graphQl related options
 * @returns generated graphQl schema
 */
export const createSchemaFromApplicationContext = <T>(
  providers: ApplicationFactory<T>[],
  state?: T,
  options?: Options<T>
): GraphQLSchema => {
  const builder = new SchemaBuilder<T>(state || {});
  providers.forEach((addToSchema) => addToSchema(builder as any));
  return builder.toSchema({ ...(options || {}) });
};
