import * as crypto from "crypto";

const salt = process.env.SALT;

export const hashSha512: Function = (password: string): String => {
  return crypto.createHmac("sha512", salt).update(password).digest("base64");
};
