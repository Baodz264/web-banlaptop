import ProductAccessoryRepository from "./productAccessory.repository.js";

class ProductAccessoryService {

  static async getAccessoriesByProduct(product_id) {
    return await ProductAccessoryRepository.findByProduct(product_id);
  }

  static async addAccessory(data) {
    return await ProductAccessoryRepository.create(data);
  }

  static async removeAccessory(product_id, accessory_id) {
    return await ProductAccessoryRepository.delete(product_id, accessory_id);
  }

  static async removeAllAccessories(product_id) {
    return await ProductAccessoryRepository.deleteByProduct(product_id);
  }
}

export default ProductAccessoryService;
