import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  address: string;
  password: string;
  refreshTokenHash?: string | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): UserModel {
  const Users = sequelize.define<UserInstance>(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // Hash du refresh token en cours : permet la rotation et la déconnexion
      refreshTokenHash: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Users;
}
