import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Contract = sequelize.define(
  "Contract",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    supplier_id: DataTypes.INTEGER,

    contract_code: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    file: DataTypes.STRING(255),

    status: DataTypes.ENUM("active", "expired", "cancelled"),
  },
  {
    tableName: "contracts",
    timestamps: false,
  }
);

export default Contract;
