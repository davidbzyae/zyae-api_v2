import bcrypt from "bcrypt";

import { UserModel } from "@/models";
import {
  AppError,
  ConflictError,
  ErrorDetail,
  UnauthorizedError,
} from "@/types";
import { newInternalError } from "@/utils";

export const authenticateUser = async (
  process: string,
  credentials: { email: string; password: string }
) => {
  try {
    process = process + ".AuthenticateUser";

    const invalidCredentialsError = new UnauthorizedError(
      "Invalid credentials",
      [
        new ErrorDetail("Unauthorized", "Invalid credentials", {
          process,
        }),
      ]
    );

    const user = await UserModel.findOne({
      "auth.email": credentials.email,
    }).lean();

    if (!user) throw invalidCredentialsError;

    if (user.auth.provider !== "local")
      throw new ConflictError("Email registered with social account", [
        new ErrorDetail("Conflict", "Email registered with social account", {
          process,
        }),
      ]);

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.auth.password
    );
    if (!passwordMatch) throw invalidCredentialsError;

    return user;
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
