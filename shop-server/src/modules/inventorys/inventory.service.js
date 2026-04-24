import InventoryRepository from "./inventory.repository.js";

class InventoryService {

  static async getInventories(query) {
    return await InventoryRepository.findAll(query);
  }

  static async getInventoryById(id) {

    const inventory = await InventoryRepository.findById(id);

    if (!inventory) {
      throw new Error("Không tìm thấy tồn kho");
    }

    return inventory;
  }

  static async createInventory(data) {

    return await InventoryRepository.create(data);
  }

  static async updateInventory(id, data) {

    const inventory = await InventoryRepository.findById(id);

    if (!inventory) {
      throw new Error("Không tìm thấy tồn kho");
    }

    return await InventoryRepository.update(id, data);
  }

  static async deleteInventory(id) {

    const inventory = await InventoryRepository.findById(id);

    if (!inventory) {
      throw new Error("Không tìm thấy tồn kho");
    }

    return await InventoryRepository.delete(id);
  }
}

export default InventoryService;
