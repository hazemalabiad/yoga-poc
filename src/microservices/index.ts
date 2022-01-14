import { loadFiles } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";
import fs from "fs";
import { print } from "graphql";
import { createServer } from "graphql-yoga";

(async () => {
  // merge schemas
  const schemaFiles = await loadFiles(`${__dirname}/**/*.graphql`, {
    recursive: true,
  });
  const typeDefs = mergeTypeDefs(schemaFiles);
  fs.writeFileSync("schema.graphql", print(typeDefs));

  // merge resolvers
  const resolversFiles = await loadFiles(`${__dirname}/**/*.resolvers.ts`, {
    recursive: true,
  });
  const resolvers: any = mergeResolvers(resolversFiles);

  const server = createServer({
    typeDefs,
    resolvers,
    context: async (req) => {
      console.log(req.headers?.get("name"));
    },
  });

  server.start(() => {
    console.log(`🚀 microservices are running on http://localhost:4000`);
  });
})();
