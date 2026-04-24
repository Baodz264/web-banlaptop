import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const PromotionItem = sequelize.define(
  "PromotionItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    promotion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    apply_type: {
      type: DataTypes.ENUM(
        "all",
        "category",
        "product",
        "variant",
        "brand"
      ),
      allowNull: false,
    },

    category_id: DataTypes.INTEGER,

    product_id: DataTypes.INTEGER,

    variant_id: DataTypes.INTEGER,

    brand_id: DataTypes.INTEGER,
  },
  {
    tableName: "promotion_applies",
    timestamps: false,
  }
);

export default PromotionItem;
