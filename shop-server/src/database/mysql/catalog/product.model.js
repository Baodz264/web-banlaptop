import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Product = sequelize.define(
  "Product",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },

    description: DataTypes.TEXT,

    thumbnail: DataTypes.STRING(255),

    product_type: {
      type: DataTypes.ENUM("main", "accessory"),
      defaultValue: "main",
    },

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    deleted_at: DataTypes.DATE,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: DataTypes.DATE,
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

export default Product;
