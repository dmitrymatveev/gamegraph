import { server } from '../src';

server.start({
  renderDocs: true,
  controlUrl: 'http://localhost:5561',
  schemaProviders: [
    (schema) => {
      schema.queryType({
        fields: (t) => ({
          hello: t.string({
            resolve: () => 'Hello \\o/',
          }),
        }),
      });
  
      schema.subscriptionType({
        fields: (t) => ({
          greetings: t.string({
            resolve(root, args, context) {
              console.log('resolve', context);
              return 'event ' + root;
            },
            async *subscribe(root, args, context) {
              console.log('subscribe');
              for (var event in [0, 0, 0, 0]) {
                yield event;
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
            },
          }),
        }),
      });
    },
  ]
});
