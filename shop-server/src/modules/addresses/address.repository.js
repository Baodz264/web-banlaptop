import UserAddress from "../../database/mysql/user/userAddress.model.js";
import User from "../../database/mysql/user/user.model.js";
import Order from "../../database/mysql/order/order.model.js";

class UserAddressRepository {

  // Admin xem tất cả địa chỉ
  static async findAll() {
    return await UserAddress.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
        {
          model: Order,
          attributes: ["id"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  static async findAllByUser(userId) {
    return await UserAddress.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
        {
          model: Order,
          attributes: ["id"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  static async findById(id) {
    return await UserAddress.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "refresh_token"],
          },
        },
        {
          model: Order,
          attributes: ["id"],
        },
      ],
    });
  }

  static async create(data) {
    return await UserAddress.create(data);
  }

  static async update(id, data) {
    await UserAddress.update(data, {
      where: { id },
    });

    return await this.findById(id);
  }

  static async delete(id) {
    return await UserAddress.destroy({
      where: { id },
    });
  }

  static async resetDefault(userId) {
    await UserAddress.update(
      { is_default: 0 },
      { where: { user_id: userId } }
    );
  }
}

export default UserAddressRepository;
