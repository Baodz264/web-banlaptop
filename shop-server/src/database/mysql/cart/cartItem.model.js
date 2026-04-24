import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    bundle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cart_items",
    timestamps: false,
  }
);

export default CartItem;
