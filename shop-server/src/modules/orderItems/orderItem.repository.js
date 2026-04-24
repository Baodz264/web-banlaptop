import { Op } from "sequelize";

import {
  OrderItem,
  Order,
  Variant,
  Product,
  Brand,
  Category,
  ProductImage,
  ProductBundle,
  ProductBundleItem,
  AttributeValue,
  Attribute
} from "../../database/mysql/index.js";

import Pagination from "../../utils/pagination.js";

class OrderItemRepository {

  /**
   * Include chuẩn cho OrderItem + Variant + Product info + Attributes + Bundles
   */
  static includeConfig = [
    { model: Order },

    {
      model: Variant,
      include: [
        {
          model: AttributeValue,
          include: [{ model: Attribute }], // ✅ Attribute info
        },
        {
          model: Product,
          include: [
            { model: Brand },
            { model: Category },
            { model: ProductImage }
          ]
        }
      ]
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
                  include: [Attribute], // ✅ Attribute info cho bundle
                },
                {
                  model: Product,
                  include: [ProductImage]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  // ====================== Lấy OrderItem theo ID ======================
  static async findById(id) {
    const item = await OrderItem.findOne({
      where: { id },
      include: this.includeConfig
    });

    return await this.attachBundles(item);
  }

  // ====================== Lấy tất cả OrderItem với filter & pagination ======================
  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);
    const { order_id, variant_id, bundle_id } = query;

    const where = {};
    if (order_id) where.order_id = order_id;
    if (variant_id) where.variant_id = variant_id;
    if (bundle_id) where.bundle_id = bundle_id;

    const data = await OrderItem.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
      include: this.includeConfig
    });

    const results = await Promise.all(data.rows.map(item => this.attachBundles(item)));

    return Pagination.getPagingData({ count: data.count, rows: results }, page, limit);
  }

  // ====================== Tạo OrderItem ======================
  static async create(data) {
    // ✅ Auto tính total_price nếu FE không gửi
    if (!data.total_price) {
      data.total_price = Number(data.price) * Number(data.quantity);
    }

    const item = await OrderItem.create(data);
    return await this.findById(item.id);
  }

  // ====================== Cập nhật OrderItem ======================
  static async update(id, data) {
    // ✅ Auto tính lại total_price khi update
    if (data.price && data.quantity) {
      data.total_price = Number(data.price) * Number(data.quantity);
    }

    await OrderItem.update(data, { where: { id } });
    return await this.findById(id);
  }

  // ====================== Xóa OrderItem ======================
  static async delete(id) {
    await OrderItem.destroy({ where: { id } });
    return true;
  }

  /**
   * Attach Bundles & Format Data giống CartRepository
   */
  static async attachBundles(orderItem) {
    if (!orderItem) return null;

    const itemJson = orderItem.get({ plain: true });

    const bundleItems = itemJson.bundle ? (itemJson.bundle.bundleItems || []) : [];

    itemJson.bundles = bundleItems.map(bi => ({
      bundle_item_id: bi.id,
      variant_id: bi.variant_id,
      product_id: bi.variant?.Product?.id,
      name: bi.variant?.Product?.name,
      thumbnail: bi.variant?.Product?.thumbnail,
      brand: bi.variant?.Product?.Brand?.name,
      category: bi.variant?.Product?.Category?.name,
      AttributeValues: bi.variant?.AttributeValues || [],
      quantity: bi.quantity,
      price: bi.variant?.price,
      sku: bi.variant?.sku
    }));

    return itemJson;
  }
}

export default OrderItemRepository;
