import VoucherRepository from "./voucher.repository.js";

class VoucherService {

  static async getVouchers(query) {
    return await VoucherRepository.findAll(query);
  }

  static async getVoucherById(id) {

    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher");
    }

    return voucher;
  }

  static async createVoucher(data) {

    const exist = await VoucherRepository.findByCode(data.code);

    if (exist) {
      throw new Error("Mã voucher đã tồn tại");
    }

    return await VoucherRepository.create(data);
  }

  static async updateVoucher(id, data) {

    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher");
    }

    return await VoucherRepository.update(id, data);
  }

  static async deleteVoucher(id) {

    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Không tìm thấy voucher");
    }

    return await VoucherRepository.delete(id);
  }
}

export default VoucherService;
