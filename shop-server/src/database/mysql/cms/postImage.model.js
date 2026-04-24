import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const PostImage = sequelize.define(
  "PostImage",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "post_images",
    timestamps: false,
  }
);

export default PostImage;
