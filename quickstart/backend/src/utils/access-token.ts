import { Request } from "express";

export const ACCESS_TOKEN_NAME = "ndao_token";

export const getAccessToken = (req: Request) => {
  const token = req.cookies[ACCESS_TOKEN_NAME];

  if (!token) throw new Error("No access token found in cookies");

  return token;
};
