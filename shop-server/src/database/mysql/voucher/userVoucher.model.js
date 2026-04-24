import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const UserVoucher = sequelize.define(
  "UserVoucher",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    is_used: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },

    received_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    used_at: DataTypes.DATE,
  },
  {
    tableName: "user_vouchers",
    timestamps: false,
  }
);

export default UserVoucher;
