import { redis } from "@/loaders";
import { newInternalError } from "@/utils";

export const deleteSession = async (process: string, sid: string) => {
  try {
    process = process + ".DeleteSession";
    redis.json.del(`session:${sid}`, ".");
  } catch (err) {
    throw newInternalError(process, err);
  }
};
