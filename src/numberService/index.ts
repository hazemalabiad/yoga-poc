import { buildSubgraphSchema } from "@apollo/federation";
import { createServer } from "graphql-yoga";
import { loadTypeDefsSync } from "../utls";

const NEW_NUMBER = "newNumber";
const NUMBER_PORT = 4001;

const keys: Record<string, string> = {
  "1": "secret-key-1",
  "2": "secret-key-2",
  "3": "secret-key-3",
};

const service = async () => {
  const typeDefs = loadTypeDefsSync(`${__dirname}/number.graphql`);

  const resolvers = {
    Mutation: {
      broadcastRandomNumber: () => {
        const num = Math.random();
        return num;
      },
    },
    Query: {
      hello: () => "hello, number!",
    },
    User: {
      secretKey: async ({ id }: any) => {
        return keys[id];
      },
    },
  };

  const schema = buildSubgraphSchema({
    typeDefs,
    resolvers,
  });

  const serviceParams = {
    url: `http://localhost:${NUMBER_PORT}`,
    name: "number",
  };

  const server = createServer({
    schema,
    port: NUMBER_PORT,
    endpoint: "/graphql",
  });

  server.start(() => {
    console.log(
      `🚀 ${serviceParams.name} microservice running at ${serviceParams.url}`
    );
  });

  return { ...serviceParams };
};

export default service;
