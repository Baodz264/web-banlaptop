import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Topic = sequelize.define(
  "Topic",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },

    description: DataTypes.TEXT,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "topics",
    timestamps: false,
  }
);

export default Topic;
