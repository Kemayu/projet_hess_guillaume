import { createHash, randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { auth } from "../config";

export interface TokenPayload {
  sub: number;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Access token : courte durée, envoyé à chaque requête protégée
const signAccessToken = (payload: TokenPayload): string =>
  jwt.sign({ email: payload.email }, auth.accessSecret, {
    subject: String(payload.sub),
    expiresIn: auth.accessExpiresIn
  });

// Refresh token : longue durée, sert uniquement à obtenir un nouvel access token
const signRefreshToken = (payload: TokenPayload): string =>
  jwt.sign({ email: payload.email }, auth.refreshSecret, {
    subject: String(payload.sub),
    expiresIn: auth.refreshExpiresIn,
    jwtid: randomUUID() // rend chaque refresh token unique
  });

export const createTokenPair = (payload: TokenPayload): TokenPair => ({
  accessToken: signAccessToken(payload),
  refreshToken: signRefreshToken(payload)
});

const toPayload = (decoded: string | jwt.JwtPayload): TokenPayload => {
  if (typeof decoded === "string" || !decoded.sub) {
    throw new Error("Token invalide.");
  }
  return { sub: Number(decoded.sub), email: String(decoded.email) };
};

export const verifyAccessToken = (token: string): TokenPayload =>
  toPayload(jwt.verify(token, auth.accessSecret));

export const verifyRefreshToken = (token: string): TokenPayload =>
  toPayload(jwt.verify(token, auth.refreshSecret));

// Seul le hash du refresh token est stocké en base, jamais le token lui-même
export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
