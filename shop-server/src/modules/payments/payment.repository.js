import Payment from "../../database/mysql/payment/payment.model.js";
import Order from "../../database/mysql/order/order.model.js";
import User from "../../database/mysql/user/user.model.js";
import UserAddress from "../../database/mysql/user/userAddress.model.js";

import Pagination from "../../utils/pagination.js";

class PaymentRepository {

  static orderInclude = {
    model: Order,
    attributes: {
      exclude: ["updated_at"]
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password", "refresh_token"]
        }
      },
      {
        model: UserAddress
      }
    ]
  };

  static async findById(id) {
    return await Payment.findOne({
      where: { id },
      include: [this.orderInclude]
    });
  }

  static async findByOrderId(order_id) {
    return await Payment.findAll({
      where: { order_id },
      include: [this.orderInclude],
      order: [["id", "DESC"]]
    });
  }

  static async findAll(query) {

    const { page, limit, offset } = Pagination.getPagination(query);

    const { status, method, order_id } = query;

    const where = {};

    if (status) where.status = status;
    if (method) where.method = method;
    if (order_id) where.order_id = order_id;

    const data = await Payment.findAndCountAll({
      where,
      include: [this.orderInclude],
      limit,
      offset,
      order: [["id", "DESC"]]
    });

    return Pagination.getPagingData(data, page, limit);
  }

  static async create(data) {
    const payment = await Payment.create(data);
    return await this.findById(payment.id);
  }

  static async update(id, data) {
    await Payment.update(data, { where: { id } });
    return await this.findById(id);
  }

  static async delete(id) {
    await Payment.destroy({ where: { id } });
    return true;
  }
}

export default PaymentRepository;
