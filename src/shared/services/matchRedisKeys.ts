import { redis } from "@/loaders";
import { DeepPartial } from "@/types";
import { newInternalError } from "@/utils";

const isMatch = <T>(data: T, filter: object) => {
  for (const prop in filter) {
    if (prop.includes(".")) {
      const nestedProps = prop.split(".");
      let currentData = data;
      for (const nestedProp of nestedProps) {
        currentData = currentData[nestedProp];
        if (currentData === undefined) return false;
      }
      if (currentData !== filter[prop]) return false;
    } else if (typeof filter[prop] === "object" && filter[prop] !== null) {
      if (!isMatch<T>(data[prop], filter[prop])) return false;
    } else if (data[prop] !== filter[prop]) {
      return false;
    }
  }
  return true;
};

export const matchRedisKeys = async <T>(
  process: string,
  prefix: string,
  filter: DeepPartial<T>
): Promise<(T | void)[]> => {
  try {
    process = process + ".MatchRedisKeys";

    const { keys } = await redis.scan(0, {
      MATCH: `${prefix}:*`,
    });

    const matches: T[] = [];

    for (const key of keys) {
      const keyData = (await redis.json.get(key)) as T | null;
      if (isMatch(keyData, filter)) matches.push(keyData);
    }

    return matches;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
