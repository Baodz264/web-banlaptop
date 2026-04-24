import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Category = sequelize.define(
  "Category",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },

    image: DataTypes.STRING(255),

    parent_id: DataTypes.INTEGER,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    deleted_at: DataTypes.DATE,
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

export default Category;
