import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    paid_at: DataTypes.DATE,
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

export default Payment;
