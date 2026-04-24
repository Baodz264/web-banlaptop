import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wishlists",
    timestamps: false,
  }
);

export default Wishlist;
