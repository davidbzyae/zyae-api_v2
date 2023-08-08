import { RedisClientType, createClient } from "redis";

import { Logger } from "./logger";
import { Session } from "@/types";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

export let redis: RedisClientType;

export const redisLoader = async ({ io }: { io: SocketServer }) => {
  redis = createClient();

  const pubClient = redis;
  const subClient = redis.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  Logger.info(
    `Connected to Redis on address: ${(await redis.CLIENT_INFO()).laddr}`
  );

  io.adapter(createAdapter(pubClient, subClient));
};
