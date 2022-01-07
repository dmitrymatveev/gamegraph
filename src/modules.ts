// import SchemaBuilder from '@giraphql/core';
import { Container } from 'brandi';
import GiraphQlBuilder from '@giraphql/core';
import { GraphQLSchema } from 'graphql';


export type SchemaTypes = Partial<GiraphQLSchemaTypes.UserSchemaTypes & { Context: Container }>

export type SchemaBuilder = GiraphQLSchemaTypes.SchemaBuilder<GiraphQLSchemaTypes.ExtendDefaultTypes<SchemaTypes>>

/**
 * GraphQL Schema factory function.
 */
export type SchemaProvider = (builder: SchemaBuilder) => void;

export const buildSchemaFromProviders = (providers: SchemaProvider[]): GraphQLSchema => {
    const builder = new GiraphQlBuilder<{ Context: Container }>({});
    providers.forEach(addToSchema => addToSchema(builder));
    return builder.toSchema({});
}