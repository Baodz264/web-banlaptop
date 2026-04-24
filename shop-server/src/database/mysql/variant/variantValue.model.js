import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const VariantValue = sequelize.define(
  "VariantValue",
  {
    variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    attribute_value_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "product_variant_values",
    timestamps: false,
  }
);

export default VariantValue;
