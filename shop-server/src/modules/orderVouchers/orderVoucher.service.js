import OrderVoucherRepository from "./orderVoucher.repository.js";

class OrderVoucherService {

  static async getOrderVouchers() {
    return await OrderVoucherRepository.findAll();
  }

  static async getOrderVoucherById(id) {

    const voucher = await OrderVoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher của đơn hàng");
    }

    return voucher;
  }

  static async createOrderVoucher(data) {
    return await OrderVoucherRepository.create(data);
  }

  static async updateOrderVoucher(id, data) {

    const voucher = await OrderVoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher của đơn hàng");
    }

    return await OrderVoucherRepository.update(id, data);
  }

  static async deleteOrderVoucher(id) {

    const voucher = await OrderVoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher của đơn hàng");
    }

    await OrderVoucherRepository.delete(id);

    return true;
  }

}

export default OrderVoucherService;
