import { RedisPubSub } from "graphql-redis-subscriptions";
import fs from "fs";
import { parse } from "graphql";

export const pubSub = new RedisPubSub();

export const loadTypeDefsSync = (filePath: string) => {
  return parse(fs.readFileSync(filePath, "utf-8"));
};
