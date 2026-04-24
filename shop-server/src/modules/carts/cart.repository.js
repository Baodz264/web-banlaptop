import { Op } from "sequelize";

import Cart from "../../database/mysql/cart/cart.model.js";
import CartItem from "../../database/mysql/cart/cartItem.model.js";
import Variant from "../../database/mysql/variant/variant.model.js";
import Product from "../../database/mysql/catalog/product.model.js";
import ProductImage from "../../database/mysql/catalog/productImage.model.js";
import Brand from "../../database/mysql/catalog/brand.model.js";
import Category from "../../database/mysql/catalog/category.model.js";
import ProductBundle from "../../database/mysql/catalog/productBundle.model.js";
import ProductBundleItem from "../../database/mysql/catalog/productBundleItem.model.js";

// IMPORT THÊM 2 MODEL NÀY
import AttributeValue from "../../database/mysql/attribute/attributeValue.model.js";
import Attribute from "../../database/mysql/attribute/attribute.model.js";

class CartRepository {
  /**
   * Include chuẩn cho CartItem + Variant + Product info + Attributes
   */
  static cartInclude = [
    {
      model: CartItem,
      include: [
        {
          model: Variant,
          include: [
            {
              // Lấy thông tin biến thể (VD: Màu sắc: Đỏ) cho sản phẩm lẻ
              model: AttributeValue,
              include: [{ model: Attribute }],
            },
            {
              model: Product,
              include: [
                { model: Brand },
                { model: Category },
                { model: ProductImage },
              ],
            },
          ],
        },
        {
          model: ProductBundle,
          as: "bundle",
        },
      ],
    },
  ];

  // ====================== Lấy Cart theo ID ======================
  static async findById(id) {
    const cart = await Cart.findByPk(id, {
      include: this.cartInclude,
    });
    return await this.attachBundles(cart);
  }

  // ====================== Lấy Cart theo user_id ======================
  static async findByUserId(userId) {
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: this.cartInclude,
    });
    return await this.attachBundles(cart);
  }

  // ====================== Lấy Cart theo session_key ======================
  static async findBySessionKey(sessionKey) {
    const cart = await Cart.findOne({
      where: { session_key: sessionKey },
      include: this.cartInclude,
    });
    return await this.attachBundles(cart);
  }

  // ====================== Create Cart ======================
  static async create(data) {
    return await Cart.create(data);
  }

  // ====================== Update Cart ======================
  static async update(id, data) {
    await Cart.update(data, { where: { id } });
    return await this.findById(id);
  }

  // ====================== Delete Cart ======================
  static async delete(id) {
    return await Cart.destroy({ where: { id } });
  }

  /**
   * Attach Bundles to Cart & Format Data
   */
  static async attachBundles(cart) {
    if (!cart) return null;

    const cartJson = cart.get({ plain: true });

    const bundleCartItems = (cartJson.CartItems || []).filter(
      (ci) => ci.bundle_id !== null
    );

    const bundlesPromises = bundleCartItems.map(async (ci) => {
      try {
        const bundle = await ProductBundle.findByPk(ci.bundle_id, {
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
                      // QUAN TRỌNG: Lấy biến thể cho từng sản phẩm TRONG Combo
                      model: AttributeValue,
                      include: [Attribute],
                    },
                    {
                      model: Product,
                      include: [Brand, Category, ProductImage],
                    },
                  ],
                },
              ],
            },
          ],
        });

        if (!bundle) return null;

        return {
          cart_item_id: ci.id,
          bundle_id: bundle.id,
          name: bundle.name,
          discount_type: bundle.discount_type,
          discount_value: bundle.discount_value,
          start_date: bundle.start_date,
          end_date: bundle.end_date,
          status: bundle.status,
          quantity: ci.quantity,
          items: (bundle.bundleItems || []).map((bi) => ({
            variant_id: bi.variant_id,
            product_id: bi.variant?.Product?.id,
            name: bi.variant?.Product?.name,
            thumbnail: bi.variant?.Product?.thumbnail,
            brand: bi.variant?.Product?.Brand?.name,
            category: bi.variant?.Product?.Category?.name,
            // ĐẨY ATTRIBUTE VALUES RA ĐỂ FRONTEND RENDER TAGS
            AttributeValues: bi.variant?.AttributeValues || [],
            quantity: (bi.quantity || 1) * ci.quantity,
            price: bi.variant?.price,
            sku: bi.variant?.sku, // Thêm SKU dự phòng
          })),
        };
      } catch (err) {
        console.error(`Lỗi khi xử lý bundle ${ci.bundle_id}:`, err);
        return null;
      }
    });

    const bundles = await Promise.all(bundlesPromises);
    cartJson.bundles = bundles.filter(Boolean);
    
    return cartJson;
  }
}

export default CartRepository;