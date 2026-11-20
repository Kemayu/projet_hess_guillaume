import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Le mot de passe n'est jamais stocké en clair : sel aléatoire + hash scrypt
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

// Compare un mot de passe saisi avec le hash stocké (comparaison à temps constant)
export const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) {
    return false;
  }
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(expected, actual);
};
