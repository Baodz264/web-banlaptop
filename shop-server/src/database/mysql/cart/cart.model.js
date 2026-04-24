import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },

    session_key: {
      type: DataTypes.STRING(100),
      unique: true,
    },
  },
  {
    tableName: "carts",
    timestamps: false,
  }
);

export default Cart;
