import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ProductAccessory = sequelize.define(
  "ProductAccessory",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    accessory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "product_accessories",
    timestamps: false,
  }
);

export default ProductAccessory;
