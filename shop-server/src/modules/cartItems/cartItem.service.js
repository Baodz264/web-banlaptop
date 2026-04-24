import CartItemRepository from "./cartItem.repository.js";
import ProductBundle from "../../database/mysql/catalog/productBundle.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";

class CartItemService {
  static async getCartItems(cart_id) {
    return await CartItemRepository.findAllByCart(cart_id);
  }

  static async addToCart(data) {
    const { cart_id, variant_id, bundle_id, quantity = 1 } = data;

    if (!variant_id && !bundle_id)
      throw new Error("Phải có variant hoặc bundle");

    if (variant_id && bundle_id)
      throw new Error("Chỉ được chọn 1: variant hoặc bundle");

    if (quantity < 1) throw new Error("Số lượng phải >= 1");

    // Kiểm tra tồn tại variant hoặc bundle
    if (variant_id) {
      const variant = await Variant.findByPk(variant_id);
      if (!variant) throw new Error("Variant không tồn tại");
    }

    if (bundle_id) {
      const bundle = await ProductBundle.findByPk(bundle_id);
      if (!bundle) throw new Error("Bundle không tồn tại");
    }

    // Kiểm tra item đã tồn tại
    let exist = null;
    if (variant_id)
      exist = await CartItemRepository.findByVariant(cart_id, variant_id);
    if (bundle_id)
      exist = await CartItemRepository.findByBundle(cart_id, bundle_id);

    if (exist) {
      return await CartItemRepository.update(exist.id, {
        quantity: exist.quantity + quantity,
      });
    }

    return await CartItemRepository.create({
      cart_id,
      variant_id: variant_id || null,
      bundle_id: bundle_id || null,
      quantity,
    });
  }

  static async updateCartItem(id, quantity) {
    if (quantity < 1) throw new Error("Số lượng phải >= 1");

    const item = await CartItemRepository.findById(id);
    if (!item) throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");

    return await CartItemRepository.update(id, { quantity });
  }

  static async deleteCartItem(id) {
    const item = await CartItemRepository.findById(id);

    if (!item) {
      console.warn(`CartItem ID ${id} không tồn tại`);
      return false; // trả false nếu item không tồn tại
    }

    // Nếu là combo → xóa tất cả CartItems trong bundle
    if (item.bundle_id) {
      await CartItemRepository.deleteByBundleId(item.bundle_id);
      return true;
    }

    // Hàng lẻ → xóa item bình thường
    return await CartItemRepository.delete(id);
  }
  // ===================== XÓA TOÀN BỘ GIỎ HÀNG =====================
  static async clearCart(cart_id) {
    if (!cart_id) throw new Error("Thiếu cart_id");

    const items = await CartItemRepository.findAllByCart(cart_id);

    if (!items || items.length === 0) {
      return false; // giỏ đã rỗng
    }

    await CartItemRepository.deleteByCartId(cart_id);
    return true;
  }
}

export default CartItemService;
