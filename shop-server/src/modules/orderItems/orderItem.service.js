import OrderItemRepository from "./orderItem.repository.js";
import { Variant, Product } from "../../database/mysql/index.js";

class OrderItemService {

  static async getOrderItems(query) {
    return await OrderItemRepository.findAll(query);
  }

  static async getOrderItemById(id) {

    const item = await OrderItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy sản phẩm trong đơn hàng");
    }

    return item;
  }

  static async createOrderItem(data) {

    // 🔥 VALIDATE (GIỮ NGUYÊN)
    if (!data.variant_id && !data.bundle_id) {
      throw new Error("Phải có variant_id hoặc bundle_id");
    }

    // ✅ THÊM: snapshot từ Variant (KHÔNG BẮT BUỘC)
    if (data.variant_id) {
      const variant = await Variant.findByPk(data.variant_id, {
        include: [Product]
      });

      if (variant) {
        data.product_name = data.product_name || variant.Product?.name;
        data.variant_name = data.variant_name || variant.sku;
        data.product_thumbnail = data.product_thumbnail || variant.image;
        data.weight = data.weight || variant.weight;
      }
    }

    return await OrderItemRepository.create(data);
  }

  static async updateOrderItem(id, data) {

    const item = await OrderItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy sản phẩm trong đơn hàng");
    }

    return await OrderItemRepository.update(id, data);
  }

  static async deleteOrderItem(id) {

    const item = await OrderItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy sản phẩm trong đơn hàng");
    }

    return await OrderItemRepository.delete(id);
  }
}

export default OrderItemService;
