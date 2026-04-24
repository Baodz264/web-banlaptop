import VoucherApplyRepository from "./voucherApply.repository.js";

class VoucherApplyService {

  static async getVoucherApplies(query) {
    return await VoucherApplyRepository.findAll(query);
  }

  static async getVoucherApplyById(id) {

    const item = await VoucherApplyRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy cấu hình áp dụng voucher");
    }

    return item;
  }

  static async createVoucherApply(data) {
    return await VoucherApplyRepository.create(data);
  }

  static async updateVoucherApply(id, data) {

    const item = await VoucherApplyRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy cấu hình áp dụng voucher");
    }

    return await VoucherApplyRepository.update(id, data);
  }

  static async deleteVoucherApply(id) {

    const item = await VoucherApplyRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy cấu hình áp dụng voucher");
    }

    return await VoucherApplyRepository.delete(id);
  }
}

export default VoucherApplyService;
