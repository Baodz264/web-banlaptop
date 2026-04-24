import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Brand = sequelize.define(
  "Brand",
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

    logo: DataTypes.STRING(255),
  },
  {
    tableName: "brands",
    timestamps: false,
  }
);

export default Brand;
