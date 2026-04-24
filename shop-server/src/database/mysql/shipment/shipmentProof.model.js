import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ShipmentProof = sequelize.define(
  "ShipmentProof",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: DataTypes.STRING(255),

    note: DataTypes.STRING(255),

    // 📌 loại bằng chứng
    type: {
      type: DataTypes.ENUM("pickup", "delivery"),
      defaultValue: "delivery",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "shipment_proofs",
    timestamps: false,
  }
);

export default ShipmentProof;
