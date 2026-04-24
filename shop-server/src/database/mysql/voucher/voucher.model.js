import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Voucher = sequelize.define(
  "Voucher",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    code: {
      type: DataTypes.STRING(50),
      unique: true,
    },

    name: DataTypes.STRING(255),

    type: DataTypes.ENUM("order", "shipping"),

    discount_type: DataTypes.ENUM("percent", "fixed"),

    discount_value: DataTypes.DECIMAL(10, 2),

    max_discount: DataTypes.DECIMAL(10, 2),

    min_order_value: DataTypes.DECIMAL(10, 2),

    quantity: DataTypes.INTEGER,

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "vouchers",
    timestamps: false,
  }
);

export default Voucher;
