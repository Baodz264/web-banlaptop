import { Op } from "sequelize";
import {
  Shipment,
  Order,
  User,
  UserAddress,
  OrderItem,
  OrderStatusLog,
  Voucher,
  Payment,
  ShipmentProof,
  Variant,
  Product,
  ProductBundle,
  ProductBundleItem,
  ProductImage,
  AttributeValue,
  Attribute,
  Brand,
  Category,
  ShipperLocation
} from "../../database/mysql/index.js";

import Pagination from "../../utils/pagination.js";

class ShipmentRepository {

  // ================= ORDER ITEM INCLUDE =================
  static orderItemInclude = [
    {
      model: Variant,
      include: [
        {
          model: AttributeValue,
          include: [{ model: Attribute }],
        },
        {
          model: Product,
          include: [ProductImage, Brand, Category],
        },
      ],
    },
    {
      model: ProductBundle,
      as: "bundle",
      include: [
        {
          model: ProductBundleItem,
          as: "bundleItems",
          include: [
            {
              model: Variant,
              as: "variant",
              include: [
                {
                  model: AttributeValue,
                  include: [{ model: Attribute }],
                },
                {
                  model: Product,
                  include: [ProductImage, Brand, Category],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // ================= INCLUDE FULL =================
  static detailInclude = [
    {
      model: Order,
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "refresh_token"] },
          required: false,
        },
        { model: UserAddress },
        {
          model: OrderItem,
          include: this.orderItemInclude,
        },
        {
          model: OrderStatusLog,
          include: [
            {
              model: User,
              as: "ChangedBy",
              attributes: { exclude: ["password", "refresh_token"] },
              required: false,
            },
          ],
        },
        { model: Voucher, through: { attributes: [] } },
        { model: Payment },
      ],
    },

    {
      model: User,
      as: "Shipper",
      required: false,
      attributes: { exclude: ["password", "refresh_token"] },
    },

    {
      model: ShipperLocation,
      as: "Locations",
      required: false,
      attributes: [
        "id",
        "shipper_id",
        "shipment_id",
        "latitude",
        "longitude",
        "is_active",
        "updated_at",
      ],
    },

    {
      model: ShipmentProof,
      required: false,
    },
  ];

  // ================= INCLUDE LIST =================
  static baseInclude = [
    {
      model: Order,
      include: [
        { model: Payment },
        {
          model: OrderItem,
          include: [
            {
              model: Variant,
              attributes: ["id", "sku", "price"],
              include: [
                {
                  model: Product,
                  attributes: ["id", "name", "thumbnail"],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      model: User,
      as: "Shipper",
      required: false,
      attributes: { exclude: ["password", "refresh_token"] },
    },

    {
      model: ShipperLocation,
      as: "Locations",
      required: false,
      attributes: ["latitude", "longitude", "updated_at"],
    },

    {
      model: ShipmentProof,
      required: false,
    },
  ];

  // ================= FIND BY ID =================
  static async findById(id) {
    return await Shipment.findOne({
      where: { id: Number(id) },
      include: this.detailInclude,
      order: [
        [{ model: ShipperLocation, as: "Locations" }, "updated_at", "ASC"],
      ],
    });
  }

  // ================= FIND BY ORDER ID =================
  static async findByOrderId(order_id) {
    return await Shipment.findOne({
      where: { order_id: Number(order_id) },
      include: this.detailInclude,
      order: [
        [{ model: ShipperLocation, as: "Locations" }, "updated_at", "ASC"],
      ],
    });
  }

  // ================= FIND ALL =================
  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    let {
      order_id,
      shipper_id,
      shipping_status,
      shipping_type,
      sort = "id",
      order = "DESC",
    } = query;

    const where = {};

    // 🔥 FIX QUAN TRỌNG
    if (order_id) where.order_id = Number(order_id);
    if (shipper_id) where.shipper_id = Number(shipper_id);
    if (shipping_status) where.shipping_status = shipping_status;
    if (shipping_type) where.shipping_type = shipping_type;

    // 🔥 validate sort
    const allowedSort = ["id", "created_at", "updated_at"];
    if (!allowedSort.includes(sort)) sort = "id";

    order = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    console.log("👉 QUERY WHERE:", where);

    const data = await Shipment.findAndCountAll({
      where,
      include: this.baseInclude,
      order: [[sort, order]],
      limit,
      offset,
      distinct: true,
    });

    // 🔥 fallback debug (nếu query không ra)
    if (data.rows.length === 0 && order_id) {
      console.warn("⚠️ Không tìm thấy theo order_id → thử lấy tất cả");

      const fallback = await Shipment.findAndCountAll({
        include: this.baseInclude,
        limit,
        offset,
        distinct: true,
      });

      return Pagination.getPagingData(fallback, page, limit);
    }

    return Pagination.getPagingData(data, page, limit);
  }

  // ================= CREATE =================
  static async create(data) {
    const shipment = await Shipment.create(data);
    return await this.findById(shipment.id);
  }

  // ================= UPDATE =================
  static async update(id, data) {
    await Shipment.update(data, { where: { id: Number(id) } });
    return await this.findById(id);
  }

  // ================= DELETE =================
  static async delete(id) {
    await Shipment.destroy({ where: { id: Number(id) } });
    return true;
  }
}

export default ShipmentRepository;
