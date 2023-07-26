import bcrypt from "bcrypt";

import { newInternalError } from "@/utils";

export const hashPassword = async (
  process: string,
  password: string
): Promise<string> => {
  try {
    process = process + ".HashPassword";
    return await bcrypt.hash(password, 10);
  } catch (err) {
    throw newInternalError(process, err);
  }
};
