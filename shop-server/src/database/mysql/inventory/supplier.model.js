import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Supplier = sequelize.define(
  "Supplier",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    phone: DataTypes.STRING(20),

    email: DataTypes.STRING(150),

    address: DataTypes.STRING(255),

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "suppliers",
    timestamps: false,
  }
);

export default Supplier;
