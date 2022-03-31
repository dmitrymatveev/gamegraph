import { ApplicationFactory, ExtendedDefaultContext } from './types';

export type Options<TContext extends ExtendedDefaultContext<any>> = {
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
  renderDocs?: boolean;

  /**
   * Application port. Default 8080
   */
  port?: number;

  /**
   * Pushpin publishing endpoint. Default http://localhost:5561
   * @see https://github.com/fanout/js-serve-grip#configuration
   */
  controlUrl: string;

  /**
   * List of GraphQL schema builders.
   */
  schemaProviders: ApplicationFactory<TContext>[];

  /**
   * Registers dependency injections
   */
  createRequestContext: () => TContext['Context'];
};
