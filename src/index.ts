import { ApolloGateway } from "@apollo/gateway";
import { useApolloFederation } from "@envelop/apollo-federation";
import { createServer } from "graphql-yoga";
import NumberService from "./numberService";
import UserService from "./userService";

(async () => {
  const microservices = await Promise.all([NumberService(), UserService()]);

  const gateway = new ApolloGateway({
    serviceList: microservices,
  });

  const { schema } = await gateway.load();

  const server = createServer({
    schema,
    plugins: [
      useApolloFederation({
        gateway,
      }),
    ],
  });

  server.start(() => {
    console.log(`🚀 Federation gateway running at http://localhost:4000`);
  });
})();
