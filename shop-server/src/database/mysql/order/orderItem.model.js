import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    bundle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    product_name: DataTypes.STRING(255),

    variant_name: DataTypes.STRING(255),

    product_thumbnail: DataTypes.STRING(255),

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // 🔥 snapshot cân nặng tại thời điểm mua
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },

    // 🔥 tránh phải tính lại
    total_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
    indexes: [
      { fields: ["order_id"] },
      { fields: ["variant_id"] },
      { fields: ["bundle_id"] },
    ],
    validate: {
      checkItemType() {
        if (!this.variant_id && !this.bundle_id) {
          throw new Error("OrderItem phải có variant_id hoặc bundle_id");
        }
      },
    },
  }
);

export default OrderItem;
