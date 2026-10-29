import { Sequelize } from "sequelize";
import { database } from "../config";
import definePollutions, { PollutionModel } from "./pollutions.model";

const connectionUrl =
  database.url ||
  (database.host && database.user && database.password && database.database
    ? `postgres://${encodeURIComponent(database.user)}:${encodeURIComponent(database.password)}@${database.host}:${database.port}/${database.database}`
    : "postgres://postgres:postgres@localhost:5432/pollution");

const isLocalHost = connectionUrl.includes("localhost") || connectionUrl.includes("127.0.0.1");
const useSsl =
  process.env.DB_SSL === "true" ||
  (process.env.DB_SSL !== "false" && !isLocalHost);

const sequelize = new Sequelize(connectionUrl, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {},
  define: {
    timestamps: false
  }
});

export interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  pollutions: PollutionModel;
}

export const db: Database = {
  Sequelize,
  sequelize,
  pollutions: definePollutions(sequelize, Sequelize)
};

export default db;
