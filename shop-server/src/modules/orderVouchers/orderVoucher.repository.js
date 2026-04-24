import OrderVoucher from "../../database/mysql/order/orderVoucher.model.js";

import {
  Order,
  Voucher
} from "../../database/mysql/index.js";

class OrderVoucherRepository {

  static async findById(id) {
    return await OrderVoucher.findByPk(id, {
      include: [
        {
          model: Order,
          attributes: [
            "id",
            "user_id",
            "address_id",
            "status",
            "total",
            "grand_total",
            "created_at"
          ]
        },
        {
          model: Voucher,
          attributes: [
            "id",
            "code",
            "name",
            "type",
            "discount_type",
            "discount_value",
            "max_discount",
            "min_order_value"
          ]
        }
      ]
    });
  }

  static async findAll() {
    return await OrderVoucher.findAll({
      include: [
        {
          model: Order,
          attributes: [
            "id",
            "user_id",
            "address_id",
            "status",
            "total",
            "grand_total",
            "created_at"
          ]
        },
        {
          model: Voucher,
          attributes: [
            "id",
            "code",
            "name",
            "type",
            "discount_type",
            "discount_value",
            "max_discount",
            "min_order_value"
          ]
        }
      ]
    });
  }

  static async create(data) {
    return await OrderVoucher.create(data);
  }

  static async update(id, data) {
    await OrderVoucher.update(data, {
      where: { id }
    });

    return await this.findById(id);
  }

  static async delete(id) {
    return await OrderVoucher.destroy({
      where: { id }
    });
  }

}

export default OrderVoucherRepository;
