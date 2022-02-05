// import SchemaBuilder from '@giraphql/core';
import { Container } from 'brandi';
import GraphQlBuilder from '@pothos/core';
import { GraphQLSchema } from 'graphql';

export type ApplicationContext = { Context: Container }

export type SchemaTypes = Partial<PothosSchemaTypes.UserSchemaTypes & ApplicationContext>

export type SchemaBuilder = PothosSchemaTypes.SchemaBuilder<PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>>

export type QueryBuilder = PothosSchemaTypes.QueryFieldBuilder<PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>, object & {}>

export type MutationBuilder = PothosSchemaTypes.MutationFieldBuilder<PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>, object & {}>

export type SubscriptionBuilder = PothosSchemaTypes.SubscriptionFieldBuilder<PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>, object & {}>

/**
 * GraphQL Schema factory function.
 */
export type SchemaProvider = (builder: SchemaBuilder) => void;

export const buildSchemaFromProviders = (providers: SchemaProvider[]): GraphQLSchema => {
    const builder = new GraphQlBuilder<ApplicationContext>({});
    providers.forEach(addToSchema => addToSchema(builder));
    return builder.toSchema({});
}