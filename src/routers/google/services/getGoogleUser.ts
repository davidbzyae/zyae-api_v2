import { Credentials } from "google-auth-library";
import { google } from "googleapis";

import { newInternalError } from "@/utils";

export const getGoogleUser = async (process: string, tokens: Credentials) => {
  try {
    process = process + ".GetGoogleUser";

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: tokens.access_token });
    let oauth2 = google.oauth2({
      auth: authClient,
      version: "v2",
    });
    return (await oauth2.userinfo.get()).data;
  } catch (err) {
    throw newInternalError(process, err);
  }
};
