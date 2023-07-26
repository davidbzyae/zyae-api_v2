import { oauth2_v2 } from "googleapis";
import { Types } from "mongoose";

import { User, UserModel } from "@/models";
import { LeanedUserDoc } from "@/types";
import { newInternalError } from "@/utils";

export const saveGoogleUser = async (
  process: string,
  googleUser: oauth2_v2.Schema$Userinfo
): Promise<LeanedUserDoc> => {
  try {
    process = process + ".SaveGoogleUser";

    const newUser = await new UserModel<User>({
      _id: new Types.ObjectId(),
      auth: {
        provider: "google",
        googleId: googleUser.id,
        password: null,
        email: googleUser.email,
      },
      profile: {
        displayName: googleUser.name,
        thumbnail: [{ url: googleUser.picture, width: 96, height: 96 }],
      },
      metadata: {
        createdAt: new Date(),
      },
    }).save();

    const user = newUser.toJSON();

    return user;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
