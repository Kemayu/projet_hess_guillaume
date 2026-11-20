import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";

// Vérifie l'access token envoyé dans l'en-tête "Authorization: Bearer <token>"
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: "Authentification requise." });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    res.locals.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

export default authenticate;
