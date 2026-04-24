import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysql.config.js";

const ShipperLocation = sequelize.define(
  "ShipperLocation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    shipper_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // ❗ cho phép null (rất quan trọng)
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    // 🟢 shipper đang online hay không
    is_active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "shipper_locations",
    timestamps: false,
  }
);

export default ShipperLocation;
