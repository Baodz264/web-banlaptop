import { Op } from "sequelize";
import Pagination from "../../utils/pagination.js";

import { OrderStatusLog, Order, User } from "../../database/mysql/index.js";

class OrderStatusLogRepository {

  static async findById(id) {
    return await OrderStatusLog.findOne({
      where: { id },
      include: [
        {
          model: Order,
        },
        {
          model: User,
          as: "ChangedBy",
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
      ],
    });
  }

  static async findAll(query) {
    const { page, limit, offset } = Pagination.getPagination(query);

    const {
      order_id,
      new_status,
      sort = "created_at",
      order = "DESC"
    } = query;

    const where = {};

    if (order_id) {
      where.order_id = order_id;
    }

    if (new_status) {
      where.new_status = new_status;
    }

    const data = await OrderStatusLog.findAndCountAll({
      where,
      include: [
        {
          model: Order,
        },
        {
          model: User,
          as: "ChangedBy",
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {

    // ✅ THÊM: đảm bảo created_at luôn có (khớp model)
    if (!data.created_at) {
      data.created_at = new Date();
    }

    return await OrderStatusLog.create(data);
  }
}

export default OrderStatusLogRepository;
