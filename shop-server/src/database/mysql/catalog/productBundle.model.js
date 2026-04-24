import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ProductBundle = sequelize.define(
  "ProductBundle",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    discount_type: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },

    discount_value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "product_bundles",
    timestamps: false,
  }
);

export default ProductBundle;
