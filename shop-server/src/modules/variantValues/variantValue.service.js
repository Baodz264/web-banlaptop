import VariantValueRepository from "./variantValue.repository.js";

class VariantValueService {

  static async getByVariantId(variant_id) {
    return await VariantValueRepository.findAllByVariantId(variant_id);
  }

  static async createVariantValue(data) {
    return await VariantValueRepository.create(data);
  }

  static async createMany(values) {
    return await VariantValueRepository.bulkCreate(values);
  }

  static async deleteByVariantId(variant_id) {
    return await VariantValueRepository.deleteByVariantId(variant_id);
  }

}

export default VariantValueService;
