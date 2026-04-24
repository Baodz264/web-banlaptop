import WishlistRepository from "./wishlist.repository.js";

class WishlistService {

  static async getUserWishlist(user_id) {
    return await WishlistRepository.findAllByUser(user_id);
  }

  static async addWishlist(user_id, product_id) {

    const exist = await WishlistRepository.findOne(user_id, product_id);

    // Nếu đã tồn tại
    if (exist) {
      return {
        exists: true,
        data: exist
      };
    }

    const wishlist = await WishlistRepository.create({
      user_id,
      product_id
    });

    return {
      exists: false,
      data: wishlist
    };
  }

  static async removeWishlist(user_id, product_id) {

    const exist = await WishlistRepository.findOne(user_id, product_id);

    if (!exist) {
      return {
        deleted: false
      };
    }

    await WishlistRepository.delete(user_id, product_id);

    return {
      deleted: true
    };
  }

}

export default WishlistService;
