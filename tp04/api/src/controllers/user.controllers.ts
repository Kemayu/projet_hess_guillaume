import { Request, Response } from "express";
import { randomBytes, scryptSync } from "crypto";
import { UniqueConstraintError } from "sequelize";
import db from "../models";
import { UserCreationAttributes } from "../models/users.model";

const Users = db.users;

const PASSWORD_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = ["email", "lastName", "firstName", "address", "password", "confirmPassword"] as const;

// Le mot de passe n'est jamais stocké en clair : sel aléatoire + hash scrypt
const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const getPayload = (body: unknown): UserCreationAttributes => {
  if (!body || typeof body !== "object") {
    throw new Error("Le corps de la requête est invalide.");
  }

  const input = body as Record<string, unknown>;
  const missing = fields.filter(
    (field) => typeof input[field] !== "string" || (input[field] as string).trim() === ""
  );

  if (missing.length > 0) {
    throw new Error("Tous les champs sont requis.");
  }

  const email = (input.email as string).trim().toLowerCase();
  const password = input.password as string;

  if (!EMAIL_REGEX.test(email)) {
    throw new Error("L'adresse email est invalide.");
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`);
  }
  if (password !== input.confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas.");
  }

  return {
    email,
    lastName: (input.lastName as string).trim(),
    firstName: (input.firstName as string).trim(),
    address: (input.address as string).trim(),
    password: hashPassword(password)
  };
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Users.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs: " + message
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await Users.create(getPayload(req.body));
    const { password: _password, ...data } = user.toJSON();
    res.status(201).json(data);
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({ message: "Un utilisateur avec cet email existe déjà." });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ message });
  }
};

export default { getAll, create };
