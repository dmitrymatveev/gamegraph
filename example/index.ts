import {
  server,
  Scalar,
  ApplicationFactory,
  ExtendedDefaultContext,
  QueryBuilder,
  SubscriptionBuilder,
} from '..';

type TestContext = ExtendedDefaultContext<{
  Scalars: {
    Test: Scalar<Object, Object>;
  };
  Context: {
    customContextValue: string;
  };
}>;

const helloQuery = (query: QueryBuilder<TestContext>) => ({
  hello: query.string({
    resolve: () => 'Hello \\o/',
  }),
});

const helloSubscription = (subscription: SubscriptionBuilder<TestContext>) => ({
  greetings: subscription.string({
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
});

const testApplication: ApplicationFactory<TestContext> = (schema) => {
  schema.scalarType('Test', {
    serialize: (n) => {
      return n;
    },
  });

  schema.queryType({
    fields: (t) => ({
      ...helloQuery(t),
    }),
  });

  schema.subscriptionType({
    fields: (t) => ({
      ...helloSubscription(t),
    }),
  });
};

server.start<TestContext>({
  renderDocs: true,
  controlUrl: 'http://localhost:5561',
  schemaProviders: [testApplication],
});
