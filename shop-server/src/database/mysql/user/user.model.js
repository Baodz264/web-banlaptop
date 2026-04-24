import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // cho phép null để login bằng Google/Facebook
    },

    role: {
      type: DataTypes.ENUM("admin", "staff", "customer", "shipper"),
      defaultValue: "customer",
    },

    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    google_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      comment: "Google OAuth ID",
    },

    facebook_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      comment: "Facebook OAuth ID",
    },

    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  },
);

export default User;
