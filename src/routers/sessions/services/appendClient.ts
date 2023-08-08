import { Client } from "@/types";
import { newInternalError } from "@/utils";
import { redis } from "@/loaders";

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
