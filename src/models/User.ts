import { Model, model, Schema, Types } from "mongoose";

const required = (type: any) => {
  return { required: true, type };
};

// auth
export interface Auth {
  provider: "local" | "google";
  googleId: string | null;
  password: string | null;
  email: string;
}

// profile
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
export interface Profile {
  displayName: string;
  thumbnail: Thumbnail[];
  bio?: string;
}

// metadata
export interface Metadata {
  createdAt: Date;
}

export interface User {
  _id: Types.ObjectId;
  auth: Auth;
  profile: Profile;
  metadata: Metadata;
}

type UserModelType = Model<User>;

const authSchema = new Schema<Auth & { _id: false }>({
  _id: false,
  provider: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  googleId: String,
  password: String,
  email: required(String),
});

const profileSchema = new Schema<Profile & { _id: false }>({
  _id: false,
  displayName: required(String),
  thumbnail: required([
    new Schema<Thumbnail & { _id: false }>({
      _id: false,
      url: required(String),
      width: required(String),
      height: required(String),
    }),
  ]),
  bio: String,
});

const metadataSchema = new Schema<Metadata & { _id: false }>({
  _id: false,
  createdAt: required(Date),
});

export const userSchema = new Schema<User, UserModelType>({
  _id: Schema.Types.ObjectId,
  auth: authSchema,
  profile: profileSchema,
  metadata: metadataSchema,
});

export const UserModel = model<User, UserModelType>("User", userSchema);
