import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Warranty = sequelize.define(
  "Warranty",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    warranty_code: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    status: DataTypes.ENUM(
      "active",
      "expired",
      "processing",
      "completed"
    ),
  },
  {
    tableName: "warranties",
    timestamps: false,
  }
);

export default Warranty;
