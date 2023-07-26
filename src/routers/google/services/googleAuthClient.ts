import { google } from "googleapis";

import config from "@/config";

export const client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  "https://zyae.net/api/auth/google/cb"
);
