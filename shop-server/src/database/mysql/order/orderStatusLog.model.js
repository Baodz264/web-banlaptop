import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const OrderStatusLog = sequelize.define(
  "OrderStatusLog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    old_status: DataTypes.STRING(50),

    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    changed_by: DataTypes.INTEGER,

    note: DataTypes.TEXT,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "order_status_logs",
    timestamps: false,
    indexes: [
      {
        fields: ["order_id"],
      },
    ],
  }
);

export default OrderStatusLog;
