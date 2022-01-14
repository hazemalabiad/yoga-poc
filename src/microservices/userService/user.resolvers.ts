import { pubSub } from "../../utils";

const NEW_USER = "newUser";

export const resolvers = {
  Subscription: {
    newUser: {
      subscribe: () => pubSub.asyncIterator(NEW_USER),
      resolve: (payload: any) => payload,
    },
  },
  Mutation: {
    addUser: (_: any, { name }: any) => {
      const id = "1";
      pubSub.publish(NEW_USER, { id, name });
      return { id, name };
    },
  },
  Query: {
    hello: () => "hello, user",
  },
};
