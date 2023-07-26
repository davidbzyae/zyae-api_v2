import { redis } from "@/loaders";
import { Client } from "@/types";
import { newInternalError } from "@/utils";

export const appendClient = async (
  process: string,
  sessionId: string,
  client: Client
) => {
  try {
    process = process + "AppendClient";
    await redis.json.arrAppend(
      `session:${sessionId}`,
      ".clients",
      client as any
    );
  } catch (err) {
    throw newInternalError(process, err);
  }
};
