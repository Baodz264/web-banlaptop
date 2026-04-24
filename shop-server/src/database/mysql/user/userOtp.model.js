import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const UserOtp = sequelize.define(
  "user_otps",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    otp_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    otp_type: {
      type: DataTypes.ENUM("reset_password", "verify_email"),
      defaultValue: "reset_password",
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default UserOtp;
