import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const VoucherApply = sequelize.define(
  "VoucherApply",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    voucher_id: DataTypes.INTEGER,

    apply_type: DataTypes.ENUM("all", "category", "product"),

    category_id: DataTypes.INTEGER,

    product_id: DataTypes.INTEGER,
  },
  {
    tableName: "voucher_applies",
    timestamps: false,
  }
);

export default VoucherApply;
