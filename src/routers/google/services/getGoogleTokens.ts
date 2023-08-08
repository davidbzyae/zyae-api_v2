import { client } from "./googleAuthClient";
import { newInternalError } from "@/utils";

export const getGoogleTokens = async (process: string, code: string) => {
  try {
    process = process + ".GetGoogleTokens";
    return (await client.getToken(code)).tokens;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
