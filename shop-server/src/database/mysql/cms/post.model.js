import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    topic_id: DataTypes.INTEGER,

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },

    content: DataTypes.TEXT,

    thumbnail: DataTypes.STRING(255),

    created_by: DataTypes.INTEGER,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "posts",
    timestamps: false,
  }
);

export default Post;
