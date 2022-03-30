
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';

export const docsMiddleware = () => voyagerMiddleware({ endpointUrl: '/' })