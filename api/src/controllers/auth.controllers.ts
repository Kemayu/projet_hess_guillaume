import { Request, Response } from "express";
import db from "../models";
import { UserInstance } from "../models/users.model";
import { verifyPassword } from "../utils/password";
import { createTokenPair, hashToken, TokenPair, verifyRefreshToken } from "../utils/tokens";

const Users = db.users;

// Données publiques de l'utilisateur (sans mot de passe ni hash du refresh token)
const toPublicUser = (user: UserInstance) => ({
  id: user.id,
  email: user.email,
  lastName: user.lastName,
  firstName: user.firstName,
  address: user.address
});

// Crée une nouvelle paire de tokens et mémorise le hash du refresh token
const issueTokens = async (user: UserInstance): Promise<TokenPair> => {
  const tokens = createTokenPair({ sub: user.id, email: user.email });
  await user.update({ refreshTokenHash: hashToken(tokens.refreshToken) });
  return tokens;
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = (req.body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    res.status(400).json({ message: "L'email et le mot de passe sont requis." });
    return;
  }

  try {
    const user = await Users.findOne({ where: { email: email.trim().toLowerCase() } });

    // Même message dans les deux cas pour ne pas révéler si l'email existe
    if (!user || !verifyPassword(password, user.password)) {
      res.status(401).json({ message: "Email ou mot de passe incorrect." });
      return;
    }

    const tokens = await issueTokens(user);
    res.status(200).json({ ...tokens, user: toPublicUser(user) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la connexion : " + message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = (req.body ?? {}) as Record<string, unknown>;

  if (typeof refreshToken !== "string" || !refreshToken) {
    res.status(400).json({ message: "Le refresh token est requis." });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await Users.findByPk(payload.sub);

    // Le token doit correspondre au dernier refresh token émis (rotation)
    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
      res.status(401).json({ message: "Refresh token invalide." });
      return;
    }

    const tokens = await issueTokens(user);
    res.status(200).json({ ...tokens, user: toPublicUser(user) });
  } catch {
    res.status(401).json({ message: "Refresh token invalide ou expiré." });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = (req.body ?? {}) as Record<string, unknown>;

  try {
    if (typeof refreshToken === "string" && refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      const user = await Users.findByPk(payload.sub);
      if (user && user.refreshTokenHash === hashToken(refreshToken)) {
        await user.update({ refreshTokenHash: null });
      }
    }
  } catch {
    // Token déjà invalide : rien à révoquer, la déconnexion réussit quand même
  }
  res.status(204).send();
};

export const me = async (_req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.findByPk(res.locals.userId as number);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }
    res.status(200).json(toPublicUser(user));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la récupération du profil : " + message });
  }
};

export default { login, refresh, logout, me };
