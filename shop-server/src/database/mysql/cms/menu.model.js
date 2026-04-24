import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Menu = sequelize.define(
  "Menu",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    link: DataTypes.STRING(255),

    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },

    position: DataTypes.INTEGER,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "menus",
    timestamps: false,
  },
);

export default Menu;
