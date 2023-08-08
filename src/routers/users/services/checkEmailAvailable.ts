import { AppError, ConflictError, ErrorDetail } from "@/types";

import { UserModel } from "@/models";
import { newInternalError } from "@/utils";

export const checkEmailAvailable = async (process: string, email: string) => {
  try {
    process = process + ".CheckEmailAvailable";

    const user = await UserModel.findOne({
      "auth.email": email,
    }).lean();

    if (user)
      throw new ConflictError("Email already taken", [
        new ErrorDetail("Duplicate", "Email already taken", {
          process,
        }),
      ]);
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
