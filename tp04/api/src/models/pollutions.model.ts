import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface PollutionAttributes {
  id: number;
  title: string;
  type: string;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
}

export interface PollutionCreationAttributes
  extends Optional<PollutionAttributes, "id" | "description"> {}

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

export default function definePollutions(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): PollutionModel {
  const Pollutions = sequelize.define<PollutionInstance>(
    "pollution",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      observationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "pollution",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Pollutions;
}
