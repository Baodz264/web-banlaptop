import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Attribute = sequelize.define(
  "Attribute",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "product_attributes",
    timestamps: false,
  }
);

export default Attribute;
