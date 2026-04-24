import CartRepository from "./cart.repository.js";

class CartService {

  static async getCartByUser(userId) {

    let cart = await CartRepository.findByUserId(userId);

    if (!cart) {
      cart = await CartRepository.create({
        user_id: userId
      });
    }

    return cart;
  }

  static async getCartBySession(sessionKey) {

    let cart = await CartRepository.findBySessionKey(sessionKey);

    if (!cart) {
      cart = await CartRepository.create({
        session_key: sessionKey
      });
    }

    return cart;
  }

  static async deleteCart(id) {

    const cart = await CartRepository.findById(id);

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }

    return await CartRepository.delete(id);
  }
}

export default CartService;
