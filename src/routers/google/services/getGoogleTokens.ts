import { newInternalError } from "@/utils";

import { client } from "./googleAuthClient";

export const getGoogleTokens = async (process: string, code: string) => {
  try {
    process = process + ".GetGoogleTokens";
    return (await client.getToken(code)).tokens;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
