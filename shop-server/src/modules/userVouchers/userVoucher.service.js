import UserVoucherRepository from "./userVoucher.repository.js";
import UserVoucher from "../../database/mysql/voucher/userVoucher.model.js";
import Voucher from "../../database/mysql/voucher/voucher.model.js";

class UserVoucherService {
  static async getUserVouchers(query) {
    return await UserVoucherRepository.findAll(query);
  }

  static async getUserVoucherById(id) {
    const item = await UserVoucherRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy voucher của người dùng");
    }

    return item;
  }

  static async createUserVoucher(data) {
    const { user_id, voucher_id } = data;

    if (!user_id || !voucher_id) {
      throw new Error("Thiếu user_id hoặc voucher_id");
    }

    /* kiểm tra voucher tồn tại */

    const voucher = await Voucher.findByPk(voucher_id);

    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }

    /* kiểm tra đã nhận chưa */

    const exist = await UserVoucher.findOne({
      where: {
        user_id,
        voucher_id,
      },
    });

    if (exist) {
      throw new Error("Bạn đã nhận voucher này");
    }

    /* tạo voucher */

    return await UserVoucherRepository.create({
      user_id,
      voucher_id,
    });
  }

  static async updateUserVoucher(id, data) {
    const item = await UserVoucherRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy voucher của người dùng");
    }

    return await UserVoucherRepository.update(id, data);
  }

  static async deleteUserVoucher(id) {
    const item = await UserVoucherRepository.findById(id);

    if (!item) {
      throw new Error("Không tìm thấy voucher của người dùng");
    }

    return await UserVoucherRepository.delete(id);
  }
}

export default UserVoucherService;
