import PromotionRepository from "./promotion.repository.js";

class PromotionService {

  static async getPromotions(query) {
    return await PromotionRepository.findAll(query);
  }

  static async getPromotionById(id) {

    const promotion = await PromotionRepository.findById(id);

    if (!promotion) {
      throw new Error("Không tìm thấy chương trình khuyến mãi");
    }

    return promotion;
  }

  static async createPromotion(data) {

    return await PromotionRepository.create(data);
  }

  static async updatePromotion(id, data) {

    const promotion = await PromotionRepository.findById(id);

    if (!promotion) {
      throw new Error("Không tìm thấy chương trình khuyến mãi");
    }

    return await PromotionRepository.update(id, data);
  }

  static async deletePromotion(id) {

    const promotion = await PromotionRepository.findById(id);

    if (!promotion) {
      throw new Error("Không tìm thấy chương trình khuyến mãi");
    }

    return await PromotionRepository.delete(id);
  }

}

export default PromotionService;
