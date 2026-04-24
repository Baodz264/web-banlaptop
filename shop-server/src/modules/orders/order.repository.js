import { Op } from "sequelize";
import {
  Order,
  User,
  UserAddress,
  OrderItem,
  OrderStatusLog,
  Voucher,
  Payment,
  Shipment,
  ShipmentProof,
  Variant,
  Product,
  ProductBundle,
  ProductBundleItem,
  ProductImage,
  AttributeValue,
  Attribute,
  Brand,
  Category
} from "../../database/mysql/index.js";

import Pagination from "../../utils/pagination.js";

class OrderRepository {

  // ================= INCLUDE =================
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

  // ================= HELPER =================
  static attachBundles(order) {
    if (!order) return null;

    const orderJson = order.get({ plain: true });

    orderJson.OrderItems = (orderJson.OrderItems || []).map(item => {
      const bundleItems = item.bundle?.bundleItems || [];

      return {
        ...item,

        // 🔥 FLATTEN BUNDLE
        bundles: bundleItems.map(bi => ({
          bundle_item_id: bi.id,
          variant_id: bi.variant_id,
          product_id: bi.variant?.Product?.id,
          name: bi.variant?.Product?.name,
          thumbnail: bi.variant?.Product?.thumbnail,
          brand: bi.variant?.Product?.Brand?.name || null,
          category: bi.variant?.Product?.Category?.name || null,
          AttributeValues: bi.variant?.AttributeValues || [],
          quantity: bi.quantity,
          price: bi.variant?.price,
          sku: bi.variant?.sku
        }))
      };
    });

    return orderJson;
  }

  // ================= DETAIL =================
  static async findById(id) {
    const order = await Order.findOne({
      where: { id },
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
        {
          model: Shipment,
          include: [
            {
              model: User,
              as: "Shipper",
              attributes: { exclude: ["password", "refresh_token"] },
              required: false,
            },
            { model: ShipmentProof },
          ],
        },
      ],
    });

    return this.attachBundles(order);
  }

  // ================= LIST =================
  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);
    const {
      status,
      user_id,
      search,
      sort = "created_at",
      order = "DESC",
      createdAt
    } = query;

    const where = {};

    if (status) where.status = status;
    if (user_id) where.user_id = user_id;
    if (createdAt) where.created_at = createdAt;

    const userInclude = {
      model: User,
      attributes: { exclude: ["password", "refresh_token"] },
      required: false,
    };

    if (search) {
      const isNumber = !isNaN(search);

      if (!isNumber) {
        userInclude.required = true;
        userInclude.where = {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      } else {
        where.id = Number(search);
      }
    }

    const data = await Order.findAndCountAll({
      where,
      order: [[sort, order]],
      limit,
      offset,
      include: [
        userInclude,
        { model: UserAddress },
        {
          model: OrderItem,
          include: this.orderItemInclude,
        },
        { model: Voucher, through: { attributes: [] } },
        { model: Shipment },
      ],
      distinct: true,
    });

    // 🔥 attachBundles cho LIST
    const rows = data.rows.map(order => this.attachBundles(order));

    return Pagination.getPagingData(
      { count: data.count, rows },
      page,
      limit
    );
  }

  // ================= CREATE =================
  static async create(data, options = {}) {
    return await Order.create(data, options);
  }

  // ================= UPDATE =================
  static async update(id, data, options = {}) {
    await Order.update(data, {
      where: { id },
      ...options,
    });
    return await this.findById(id);
  }

  // ================= DELETE =================
  static async delete(id, options = {}) {
    await Order.destroy({
      where: { id },
      ...options,
    });
    return true;
  }
}

export default OrderRepository;
