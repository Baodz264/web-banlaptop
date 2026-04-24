import { Op } from "sequelize";
import Voucher from "../../database/mysql/voucher/voucher.model.js";
import Pagination from "../../utils/pagination.js";

class VoucherRepository {

  static async findById(id) {
    return await Voucher.findOne({
      where: { id }
    });
  }

  static async findByCode(code) {
    return await Voucher.findOne({
      where: { code }
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      search,
      type,
      status,
      sort = "id",
      order = "DESC"
    } = query;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const data = await Voucher.findAndCountAll({
      where,
      order: [[sort, order]],
      limit,
      offset
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const voucher = await Voucher.create(data);
    return await this.findById(voucher.id);
  }

  static async update(id, data) {
    await Voucher.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    await Voucher.destroy({
      where: { id }
    });

    return true;
  }
}

export default VoucherRepository;
