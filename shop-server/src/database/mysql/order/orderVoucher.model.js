import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const OrderVoucher = sequelize.define(
  "OrderVoucher",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_vouchers",
    timestamps: false,
  }
);

export default OrderVoucher;
