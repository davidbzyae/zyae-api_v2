import config from "@/config";
import { google } from "googleapis";

export const client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  "https://zyae.net/api/auth/google/cb"
);
