import { pubSub } from "../../utils";

const NEW_NUMBER = "newNumber";

const keys: Record<string, string> = {
  "1": "secret-key-1",
  "2": "secret-key-2",
  "3": "secret-key-3",
};

export const resolvers = {
  Subscription: {
    newNumber: {
      subscribe: () => pubSub.asyncIterator(NEW_NUMBER),
      resolve: (payload: any) => payload,
    },
    product: {
      subscribe: () => pubSub.asyncIterator(""),
      resolve: () => ({ id: "125", price: 1516.2, name: "product name" }),
    },
  },
  Mutation: {
    broadcastRandomNumber: () => {
      const num = Math.random();
      pubSub.publish(NEW_NUMBER, num);
      return num;
    },
  },
  Query: {
    hello: () => "hello, number!",
  },
  User: {
    secretKey: async ({ id }: any) => {
      const keyId = "1";
      return { id: keyId, body: keys[id] };
    },
  },
};
