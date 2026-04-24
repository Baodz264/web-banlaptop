import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Inventory = sequelize.define(
  "Inventory",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    supplier_id: DataTypes.INTEGER,

    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    cost_price: DataTypes.DECIMAL(12, 2),

    import_date: DataTypes.DATE,
  },
  {
    tableName: "inventories",
    timestamps: false,
  }
);

export default Inventory;
