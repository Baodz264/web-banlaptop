import VariantRepository from "./variant.repository.js";
import generateCode from "../../utils/generateCode.js";

class VariantService {

  // ✅ GET ALL
  static async getAllVariants(query) {
    const filter = {
      product_id: query.product_id || null,
      minPrice: query.minPrice ? Number(query.minPrice) : null,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : null,
    };

    return await VariantRepository.findAll(filter);
  }

  static async getVariantsByProduct(productId) {
    return await VariantRepository.findAllByProduct(productId);
  }

  static async getVariantById(id) {
    const variant = await VariantRepository.findById(id);

    if (!variant) {
      throw new Error("Không tìm thấy biến thể sản phẩm");
    }

    return variant;
  }

  // ✅ VALIDATE (QUAN TRỌNG)
  static validate(data) {
    if (!data.product_id) {
      throw new Error("Thiếu product_id");
    }

    if (!data.price || Number(data.price) <= 0) {
      throw new Error("Giá không hợp lệ");
    }

    if (data.stock !== undefined && Number(data.stock) < 0) {
      throw new Error("Stock không hợp lệ");
    }

    if (data.weight !== undefined && Number(data.weight) <= 0) {
      throw new Error("Weight phải > 0");
    }
  }

  // ✅ CREATE
  static async createVariant(data) {
    this.validate(data);

    if (!data.sku) {
      data.sku = generateCode("SKU");
    }

    // default
    data.stock = data.stock ?? 0;
    data.weight = data.weight ?? 1;

    return await VariantRepository.create(data);
  }

  // ✅ UPDATE
  static async updateVariant(id, data) {
    const variant = await VariantRepository.findById(id);

    if (!variant) {
      throw new Error("Không tìm thấy biến thể sản phẩm");
    }

    // merge để validate
    const merged = {
      ...variant.toJSON(),
      ...data,
    };

    this.validate(merged);

    return await VariantRepository.update(id, data);
  }

  // ✅ DELETE
  static async deleteVariant(id) {
    const variant = await VariantRepository.findById(id);

    if (!variant) {
      throw new Error("Không tìm thấy biến thể sản phẩm");
    }

    return await VariantRepository.delete(id);
  }
}

export default VariantService;
