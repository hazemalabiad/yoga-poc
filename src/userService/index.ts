import { buildFederatedSchema } from "@apollo/federation";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "graphql-yoga";
import { loadTypeDefsSync } from "../utls";

const NEW_USER = "newUser";
const USER_PORT = 4002;

const service = async () => {
  const typeDefs = loadTypeDefsSync(`${__dirname}/user.graphql`);

  const resolvers = {
    Subscription: {
      newUser: {
        subscribe: () => pubSub.asyncIterator(NEW_USER),
        resolve: (payload: any) => payload,
      },
    },
    Mutation: {
      addUser: (_: any, { name }: any) => {
        const id = "1";
        pubSub.publish(NEW_USER, { NEW_USER: { id, name } });
        return { id, name };
      },
    },
    Query: {
      hello: () => "hello, user",
    },
  };

  const schema = buildFederatedSchema({
    typeDefs,
    resolvers,
  });

  const serviceParams = {
    url: `http://localhost:${USER_PORT}`,
    name: "user",
  };

  const server = createServer({
    schema,
    port: USER_PORT,
    endpoint: "/graphql",
  });

  server.start(() => {
    console.log(
      `🚀 ${serviceParams.name} microservice running at ${serviceParams.url}`
    );
  });

  return { typeDefs, resolvers };
};

export default service;
