import { User, UserModel } from "@/models";

import { AppError } from "@/types";
import { Types } from "mongoose";
import { newInternalError } from "@/utils";

type UserData = {
  password: string;
  email: string;
  displayName: string;
};

export const saveUser = async (
  process: string,
  userData: UserData,
  passwordHash: string
) => {
  try {
    process = process + ".SaveUser";
    const newUser = await new UserModel<User>({
      _id: new Types.ObjectId(),
      auth: {
        provider: "local",
        googleId: null,
        email: userData.email,
        password: passwordHash,
      },
      profile: {
        displayName: userData.displayName,
        thumbnail: [
          {
            url: "https://zyae.net/assets/images/account/userdefault.png",
            width: 96,
            height: 96,
          },
        ],
      },
      metadata: {
        createdAt: new Date(),
      },
    }).save();

    const user = newUser.toJSON();
    delete user.auth.password;

    return user;
  } catch (err) {
    if (err instanceof AppError) throw err;
    else throw newInternalError(process, err);
  }
};
