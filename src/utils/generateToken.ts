import crypto from "crypto";

export const generateToken = () => crypto.randomBytes(64).toString("base64url");
