export interface DatabaseConfig {
  url?: string;
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  database?: string;
}

export interface AuthConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
}

export interface AppConfig {
  database: DatabaseConfig;
  auth: AuthConfig;
}

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn("JWT_ACCESS_SECRET / JWT_REFRESH_SECRET non définis : secrets de développement utilisés.");
}

export const config: AppConfig = {
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
    accessExpiresIn: 15 * 60,           // 15 minutes (en secondes)
    refreshExpiresIn: 7 * 24 * 60 * 60  // 7 jours (en secondes)
  }
};

export const { database, auth } = config;
export default config;
