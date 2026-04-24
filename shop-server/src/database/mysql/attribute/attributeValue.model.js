import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const AttributeValue = sequelize.define(
  "AttributeValue",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "product_attribute_values",
    timestamps: false,
  }
);

export default AttributeValue;
