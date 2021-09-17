import * as crypto from "crypto";

export const hashSha512: Function = (password: string): String => {
  const salt = process.env.SALT;
  return crypto.createHmac("sha512", salt).update(password).digest("base64");
};
