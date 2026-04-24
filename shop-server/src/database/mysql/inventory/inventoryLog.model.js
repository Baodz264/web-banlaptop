import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const InventoryLog = sequelize.define(
  "InventoryLog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("import", "export", "adjust"),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    note: DataTypes.STRING(255),

    created_by: DataTypes.INTEGER,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inventory_logs",
    timestamps: false,
  }
);

export default InventoryLog;
