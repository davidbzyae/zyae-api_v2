import { client } from "./googleAuthClient";

export const generateAuthUrl = () => {
  const url = client.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    access_type: "offline",
  });

  return url;
};
