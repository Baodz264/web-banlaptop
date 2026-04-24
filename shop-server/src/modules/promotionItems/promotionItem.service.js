import PromotionItemRepository from "./promotionItem.repository.js";

class PromotionItemService {

  static async getItems(query) {
    return await PromotionItemRepository.findAll(query);
  }

  static async getItemById(id) {

    const item = await PromotionItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy mục khuyến mãi");
    }

    return item;
  }

  static async createItem(data) {
    return await PromotionItemRepository.create(data);
  }

  static async updateItem(id, data) {

    const item = await PromotionItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy mục khuyến mãi");
    }

    return await PromotionItemRepository.update(id, data);
  }

  static async deleteItem(id) {

    const item = await PromotionItemRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy mục khuyến mãi");
    }

    return await PromotionItemRepository.delete(id);
  }
}

export default PromotionItemService;
