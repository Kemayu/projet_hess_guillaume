export interface DatabaseConfig {
  url?: string;
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  database?: string;
}

export interface AppConfig {
  database: DatabaseConfig;
}

export const config: AppConfig = {
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
};

export const { database } = config;
export default config;
