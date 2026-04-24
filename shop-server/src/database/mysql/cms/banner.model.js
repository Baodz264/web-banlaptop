import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Banner = sequelize.define(
  "Banner",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    title: DataTypes.STRING(255),

    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    link: DataTypes.STRING(255),

    position: DataTypes.STRING(100),

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "banners",
    timestamps: false,
  }
);

export default Banner;
