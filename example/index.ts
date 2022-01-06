import { server } from '../src';

server.start([
  (schema) => {
    schema.queryType({
      fields: (t) => ({
        hello: t.string({
          resolve: () => 'Hello!!!!',
        }),
      }),
    });

    schema.subscriptionType({
      fields: (t) => ({
        greetings: t.string({
          resolve(root, args, context) {
            console.log('resolve ', root)
            return 'event ' + root;
          },
          async *subscribe(root, args, context) {
            for (var event of [1, 22, 333, 4444]) {
              yield event;
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          },
        }),
      }),
    });
  },
]);
