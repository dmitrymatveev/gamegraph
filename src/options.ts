import { SchemaProvider } from './modules';

export type Options = {
    /**
     * When True, GraphiQl and graphql-voyager will be rendered.
     * Set this True in development environments.
     * 
     * http[s]://<path>:<port>/ -> GraphiQl
     * http[s]://<path>:<port>/docs -> GraphQl Voyager
     *  
     * @see https://graphql-dotnet.github.io/docs/getting-started/graphiql/
     * @see https://github.com/APIs-guru/graphql-voyager
     */
    renderDocs?: boolean
    /**
     * Application port.
     */
    port?: number
    /**
     * Pushpin publishing endpoint.
     * @see https://github.com/fanout/js-serve-grip#configuration
     */
    controlUrl: string
    /**
     * List of GraphQL schema builders.
     */
    schemaProviders: SchemaProvider[]
}