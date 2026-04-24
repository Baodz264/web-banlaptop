import OrderStatusLogRepository from "./orderStatusLog.repository.js";

class OrderStatusLogService {

  static async getLogs(query) {
    return await OrderStatusLogRepository.findAll(query);
  }

  static async getLogById(id) {

    const log = await OrderStatusLogRepository.findById(id);

    if (!log) {
      throw new Error("Không tìm thấy lịch sử trạng thái đơn hàng");
    }

    return log;
  }

  static async createLog(data) {

    // ✅ THÊM: validate theo model
    if (!data.order_id) {
      throw new Error("Thiếu order_id");
    }

    if (!data.new_status) {
      throw new Error("Thiếu new_status");
    }

    return await OrderStatusLogRepository.create(data);
  }

}

export default OrderStatusLogService;
