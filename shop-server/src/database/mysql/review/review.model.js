import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    comment: DataTypes.TEXT,

    parent_id: DataTypes.INTEGER,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_reviews",
    timestamps: false,
  }
);

export default Review;
