import WishlistService from "./wishlist.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class WishlistController {

  getWishlist = asyncHandler(async (req, res) => {

    const user_id = req.user.id;

    const wishlist = await WishlistService.getUserWishlist(user_id);

    return response.success(res, wishlist);
  });

  addWishlist = asyncHandler(async (req, res) => {

    const user_id = req.user.id;
    const { product_id } = req.body;

    const result = await WishlistService.addWishlist(user_id, product_id);

    // Nếu đã tồn tại
    if (result.exists) {
      return response.success(res, result, "Product already in wishlist");
    }

    return response.success(res, result, "Added to wishlist");
  });

  removeWishlist = asyncHandler(async (req, res) => {

    const user_id = req.user.id;
    const { product_id } = req.params;

    const result = await WishlistService.removeWishlist(user_id, product_id);

    if (!result.deleted) {
      return response.success(res, null, "Product not found in wishlist");
    }

    return response.success(res, null, "Removed from wishlist");
  });

}

export default new WishlistController();
