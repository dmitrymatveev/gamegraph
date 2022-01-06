import { WebSocketEvent, WebSocketMessageFormat } from '@fanoutio/grip';
import { RequestHandler } from 'express';
import { GraphQLSchema } from 'graphql';
import { getGraphQLParameters } from 'graphql-helix';
import { GripRequestHandlerFactory } from '../lib/GripHandlerFactory';
import { makeServer, CloseCode } from 'graphql-ws';


export const webSocketHandler: GripRequestHandlerFactory =
  ({ gripServe, schema }) =>
  async (req, res, next) => {
    console.log('WEB SOCKET');

    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    const { wsContext } = req.grip;
    if (wsContext == null) {
      res.statusCode = 400;
      res.end('[not a websocket request]\n');
      return next();
    }

    // If this is a new connection, accept it and subscribe it to a channel
    if (!wsContext.isOpening()) {
      // Open the WebSocket and subscribe it to a channel:
      wsContext.accept();
      wsContext.subscribe('test');
      wsContext.send('GQL_CONNECTION_ACK');
    }

    while (wsContext.canRecv()) {
      const message = wsContext.recv();
      console.log('receive ' + message);

      if (message == null) {
        // If return value is undefined then connection is closed
        wsContext.close();
        break;
      }

      // Echo the message
      wsContext.send(message);
    }

    const { operationName, query, variables } = getGraphQLParameters(request);
    console.log(Date.now() + ' ' + wsContext.id);

    if (!wsContext.inEvents) {
      // No events. This may be a ws-over-http KeepAlive request.
      console.log(
        'WebSocketOverHttpExpress got WebSocket-Over-Http request with zero events. May be keepalive.',
        new Date(Date.now())
      );
    }

    // The above commands made to the wsContext are buffered
    // in the wsContext as "outgoing events".
    // Obtain them and write them to the response.
    const outEvents = wsContext.getOutgoingEvents();

    for (const event of outEvents) {
      console.log(`event:${event.getType()}, ${event.getContent()}`);
    }

    res.send();
  };
