import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ReviewImage = sequelize.define(
  "ReviewImage",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    review_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: DataTypes.STRING(255),
  },
  {
    tableName: "review_images",
    timestamps: false,
  }
);

export default ReviewImage;
