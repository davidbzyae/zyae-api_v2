import mongoose from "mongoose";

import { User } from "@/models";
import { Session } from "@/types/api";

declare global {
  namespace Express {
    interface Locals {
      route: string;
      tokens: { sid: string; at: string; rt: string };
      session: Session;
      currentUser: User & mongoose.Document;
    }
  }
}
