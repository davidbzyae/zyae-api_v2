import { FlattenMaps, Types } from "mongoose";

import { User } from "@/models";

export type LeanedUserDoc = FlattenMaps<User> &
  Required<{
    _id: Types.ObjectId;
  }>;
