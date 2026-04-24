import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const Variant = sequelize.define(
  "Variant",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sku: {
      type: DataTypes.STRING(100),
      unique: true,
    },

    image: DataTypes.STRING(255),

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },


    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // 🔥 QUAN TRỌNG: dùng để tính phí ship
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
      comment: "kg",
    },

    is_default: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: DataTypes.DATE,
  },
  {
    tableName: "product_variants",
    timestamps: false,
    indexes: [
      { fields: ["product_id"] },
      { unique: true, fields: ["sku"] },
    ],
  }
);

export default Variant;
