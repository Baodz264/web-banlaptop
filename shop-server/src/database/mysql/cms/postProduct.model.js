import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const PostProduct = sequelize.define(
  "PostProduct",
  {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "post_products",
    timestamps: false,
  }
);

export default PostProduct;
