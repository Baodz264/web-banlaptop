import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const UserAddress = sequelize.define(
  "UserAddress",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    province: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    ward: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    address_detail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    is_default: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_addresses",
    timestamps: false,
  },
);

export default UserAddress;
