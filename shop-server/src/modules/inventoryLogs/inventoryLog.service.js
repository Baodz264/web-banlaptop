import InventoryLogRepository from "./inventoryLog.repository.js";

class InventoryLogService {

  static async getLogs(query) {
    return await InventoryLogRepository.findAll(query);
  }

  static async getLogById(id) {

    const log = await InventoryLogRepository.findById(id);

    if (!log) {
      throw new Error("Không tìm thấy lịch sử kho");
    }

    return log;
  }

  static async createLog(data) {
    return await InventoryLogRepository.create(data);
  }

}

export default InventoryLogService;
