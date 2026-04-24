import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Setting = sequelize.define(
  "Setting",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    key: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },

    value: DataTypes.TEXT,
  },
  {
    tableName: "settings",
    timestamps: false,
  }
);

export default Setting;
