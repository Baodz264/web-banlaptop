import CartItem from "../../database/mysql/cart/cartItem.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import ProductImage from "../../database/mysql/catalog/productImage.model.js";
import ProductBundle from "../../database/mysql/catalog/productBundle.model.js";
import ProductBundleItem from "../../database/mysql/catalog/productBundleItem.model.js";

class CartItemRepository {
  // ===================== CONFIG INCLUDE =====================
  static includeConfig = [
    // Hàng lẻ (Variant → Product → ProductImage)
    {
      model: Variant,
      include: [
        {
          model: Product,
          include: [ProductImage],
        },
      ],
    },
    // Combo / Bundle
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
                  model: Product,
                  include: [ProductImage],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // ===================== LẤY TẤT CẢ THEO CART =====================
  static async findAllByCart(cart_id) {
    if (!cart_id) return [];
    return await CartItem.findAll({
      where: { cart_id },
      include: this.includeConfig,
    });
  }

  // ===================== LẤY THEO ID =====================
  static async findById(id) {
    if (!id) return null;
    return await CartItem.findByPk(id, { include: this.includeConfig });
  }

  // ===================== LẤY HÀNG LẺ THEO VARIANT =====================
  static async findByVariant(cart_id, variant_id) {
    return await CartItem.findOne({
      where: { cart_id, variant_id, bundle_id: null },
      include: this.includeConfig,
    });
  }

  // ===================== LẤY HÀNG COMBO THEO BUNDLE =====================
  static async findByBundle(cart_id, bundle_id) {
    return await CartItem.findOne({
      where: { cart_id, bundle_id },
      include: this.includeConfig,
    });
  }

  // ===================== TẠO MỚI =====================
  static async create(data) {
    return await CartItem.create(data);
  }

  // ===================== CẬP NHẬT SỐ LƯỢNG =====================
  static async update(id, data) {
    if (!id) throw new Error("Missing CartItem ID");

    await CartItem.update(data, { where: { id } });
    return await this.findById(id);
  }

  // ===================== XÓA ITEM =====================
  static async delete(id) {
    if (!id) throw new Error("Missing CartItem ID for deletion");

    const result = await CartItem.destroy({ where: { id } });
    return result > 0; // trả true nếu xóa thành công
  }

  // ===================== XÓA THEO BUNDLE_ID =====================
  static async deleteByBundleId(bundle_id) {
    if (!bundle_id) throw new Error("Missing bundle_id for deletion");

    const result = await CartItem.destroy({ where: { bundle_id } });
    return result > 0;
  }
  // ===================== XÓA TOÀN BỘ THEO CART =====================
  static async deleteByCartId(cart_id) {
    if (!cart_id) throw new Error("Missing cart_id for deletion");

    const result = await CartItem.destroy({
      where: { cart_id },
    });

    return result > 0;
  }
}

export default CartItemRepository;
