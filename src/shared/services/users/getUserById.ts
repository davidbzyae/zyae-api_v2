import { Document, FilterQuery, FlattenMaps, Types } from "mongoose";

import { User, UserModel } from "@/models";
import {
  AppError,
  DeepPartial,
  ErrorDetail,
  LeanedUserDoc,
  NotFoundError,
} from "@/types";
import { newInternalError } from "@/utils";

type UserDoc<Leaned> = Leaned extends true ? LeanedUserDoc : User & Document;

export const getUserById = async <T extends boolean>(
  process: string,
  userId: string,
  flags: { lean?: T; throwNotFound?: boolean } = {
    lean: false as T,
    throwNotFound: true,
  }
): Promise<UserDoc<T>> => {
  try {
    process = process + ".GetUserById";

    const user = await UserModel.findById(userId).lean(flags.lean);

    if (flags.throwNotFound && !user)
      throw new NotFoundError("User not found", [
        new ErrorDetail("NotFound", "User not found", {
          process,
          flags,
        }),
      ]);

    return user as UserDoc<T>;
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
