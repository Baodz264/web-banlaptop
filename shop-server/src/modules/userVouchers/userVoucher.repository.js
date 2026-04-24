import { Op } from "sequelize";
import UserVoucher from "../../database/mysql/voucher/userVoucher.model.js";
import User from "../../database/mysql/user/user.model.js";
import Voucher from "../../database/mysql/voucher/voucher.model.js";

import Pagination from "../../utils/pagination.js";

class UserVoucherRepository {

  static async findById(id) {
    return await UserVoucher.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "refresh_token"]
          }
        },
        {
          model: Voucher
        }
      ]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const { user_id, voucher_id, is_used } = query;

    const where = {};

    if (user_id) {
      where.user_id = user_id;
    }

    if (voucher_id) {
      where.voucher_id = voucher_id;
    }

    if (is_used !== undefined) {
      where.is_used = is_used;
    }

    const data = await UserVoucher.findAndCountAll({
      where,
      limit,
      offset,
      order: [["received_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "refresh_token"]
          }
        },
        {
          model: Voucher
        }
      ]
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {

    const item = await UserVoucher.create(data);

    return await this.findById(item.id);
  }

  static async update(id, data) {

    await UserVoucher.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {

    await UserVoucher.destroy({
      where: { id }
    });

    return true;
  }

}

export default UserVoucherRepository;
