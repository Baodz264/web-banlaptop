import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ProductSpecification = sequelize.define(
  "ProductSpecification",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    spec_group: DataTypes.STRING(150),

    spec_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    spec_value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_specifications",
    timestamps: false,
  }
);

export default ProductSpecification;
