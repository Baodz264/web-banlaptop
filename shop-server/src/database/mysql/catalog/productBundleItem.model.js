import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ProductBundleItem = sequelize.define(
  "ProductBundleItem",
  {
    bundle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "product_bundle_items",
    timestamps: false,
  }
);

export default ProductBundleItem;
