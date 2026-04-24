import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    user_id: DataTypes.INTEGER,

    address_id: DataTypes.INTEGER,

    // 📍 snapshot địa chỉ (QUAN TRỌNG)
    shipping_address: DataTypes.JSON,

    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    discount_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    grand_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "awaiting_payment",
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled",
        "returned"
      ),
      defaultValue: "pending",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

export default Order;
