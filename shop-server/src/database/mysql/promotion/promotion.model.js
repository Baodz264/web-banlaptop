import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },

    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    usage_limit: DataTypes.INTEGER,

    start_date: DataTypes.DATE,

    end_date: DataTypes.DATE,

    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "promotions",
    timestamps: false,
  }
);

export default Promotion;
