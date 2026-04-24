import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Shipment = sequelize.define(
  "Shipment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    shipper_id: DataTypes.INTEGER,

    tracking_code: DataTypes.STRING(100),

    carrier: DataTypes.STRING(100),

    // 🚀 loại ship
    shipping_type: {
      type: DataTypes.ENUM("standard", "express"),
      defaultValue: "standard",
    },

    // 💰 phí ship (snapshot)
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    // 📍 khoảng cách
    distance_km: DataTypes.FLOAT,

    // 📍 tọa độ shop
    from_lat: DataTypes.DECIMAL(10, 8),
    from_lng: DataTypes.DECIMAL(11, 8),

    // 📍 tọa độ khách
    to_lat: DataTypes.DECIMAL(10, 8),
    to_lng: DataTypes.DECIMAL(11, 8),

    shipping_status: {
      type: DataTypes.ENUM(
        "pending",
        "picked",
        "shipping",
        "delivered",
        "failed",
      ),
      defaultValue: "pending",
    },

    shipped_at: DataTypes.DATE,

    delivered_at: DataTypes.DATE,

    // ⏱️ dự kiến giao
    estimated_delivery_at: DataTypes.DATE,
  },
  {
    tableName: "shipments",
    timestamps: false,
  },
);

export default Shipment;
