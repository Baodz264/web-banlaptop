import { 
  ProductAccessory, 
  Product, 
  Variant, 
  Brand,
  AttributeValue,
  Attribute,
  Inventory,
  Supplier
} from "../../database/mysql/index.js";

class ProductAccessoryRepository {

  // ================= GET ACCESSORIES BY PRODUCT =================
  static async findByProduct(product_id) {
    return await ProductAccessory.findAll({
      where: { product_id },

      include: [
        {
          model: Product,
          as: "accessory",

          attributes: {
            exclude: ["created_at", "updated_at"]
          },

          include: [
            // ===== BRAND =====
            {
              model: Brand,
              attributes: ["id", "name", "slug"]
            },

            // ===== VARIANT (giống ProductRepository) =====
            {
              model: Variant,
              required: false,

              attributes: ["id", "price", "sku", "stock", "image", "weight"],

              include: [
                // ===== ATTRIBUTE =====
                {
                  model: AttributeValue,
                  attributes: ["id", "value"],
                  through: { attributes: [] },
                  include: [
                    {
                      model: Attribute,
                      attributes: ["id", "name"]
                    }
                  ]
                },

                // ===== INVENTORY =====
                {
                  model: Inventory,
                  attributes: ["id", "quantity"],
                  include: [
                    {
                      model: Supplier,
                      attributes: ["id", "name"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  }

  // ================= CREATE =================
  static async create(data) {
    return await ProductAccessory.create(data);
  }

  // ================= DELETE ONE =================
  static async delete(product_id, accessory_id) {
    return await ProductAccessory.destroy({
      where: { product_id, accessory_id }
    });
  }

  // ================= DELETE ALL BY PRODUCT =================
  static async deleteByProduct(product_id) {
    return await ProductAccessory.destroy({
      where: { product_id }
    });
  }

}

export default ProductAccessoryRepository;
