import {
  server,
  Scalar,
  ApplicationFactory,
  ExtendedDefaultContext,
  QueryBuilder,
  SubscriptionBuilder,
  ApplicationSchemaBuilder,
} from '..';

type TestContext = ExtendedDefaultContext<{
  Scalars: {
    Test: Scalar<Object, Object>;
  };
  Context: {
    customContextValue: string;
  };
}>;

class TestItem {
  id?: string
}

const helloQuery = (query: QueryBuilder<TestContext>) => ({
  hello: query.string({
    resolve: () => 'Hello \\o/',
  }),
});

const loadableObject = (query: QueryBuilder<TestContext>, schema: ApplicationSchemaBuilder<TestContext>) => ({
  user: query.field({
    type: schema.loadableObject(TestItem.name, {
      fields: (t) => ({
        id: t.exposeString('id' as never),
      }),
      load: (ids, context) => {

        // assume there is datastore
        const data = {
          'a': { id: 'a' },
          'b': { id: 'b' },
          'c': { id: 'c' },
        } as {[key:string|symbol]:any};
  
        const proxy = new Proxy(data, {
          get: (data, key) => data[key] || new Error('missing'),
        });
  
        // load data from database
        return new Promise<(TestItem | Error)[]>((resolve, reject) => {
          const value = (id: string|number|bigint) => {
            const res = proxy[`${id}`];
            return res;
          }

          const loadedValues = ids.map(value);
          resolve(loadedValues);
        });
      },
    }),
    args: {
      id: query.arg.string({ required: true }),
    },
    // Here we can just return the ID directly rather than loading the user ourselves
    resolve: (root, args) => {
      return args.id;
    }
  })
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
      ...loadableObject(t, schema)
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
