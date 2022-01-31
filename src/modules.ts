// import SchemaBuilder from '@giraphql/core';
import { Container } from 'brandi';
import GraphQlBuilder from '@pothos/core';
import { GraphQLSchema } from 'graphql';


export type SchemaTypes = Partial<PothosSchemaTypes.UserSchemaTypes & { Context: Container }>

export type SchemaBuilder = PothosSchemaTypes.SchemaBuilder<PothosSchemaTypes.ExtendDefaultTypes<SchemaTypes>>

/**
 * GraphQL Schema factory function.
 */
export type SchemaProvider = (builder: SchemaBuilder) => void;

export const buildSchemaFromProviders = (providers: SchemaProvider[]): GraphQLSchema => {
    const builder = new GraphQlBuilder<{ Context: Container }>({});
    providers.forEach(addToSchema => addToSchema(builder));
    return builder.toSchema({});
}