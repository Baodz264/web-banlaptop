import CartItemService from "./cartItem.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class CartItemController {
  // Lấy tất cả item trong giỏ
  getCartItems = asyncHandler(async (req, res) => {
    const items = await CartItemService.getCartItems(req.params.cart_id);
    return response.success(res, items);
  });

  // Thêm variant hoặc bundle vào giỏ
  addToCart = asyncHandler(async (req, res) => {
    const item = await CartItemService.addToCart(req.body);
    return response.success(res, item, "Added to cart");
  });

  // Cập nhật số lượng item
  updateCartItem = asyncHandler(async (req, res) => {
    const item = await CartItemService.updateCartItem(
      req.params.id,
      req.body.quantity,
    );
    return response.success(res, item, "Cart updated");
  });

  // Xóa item khỏi giỏ
  deleteCartItem = asyncHandler(async (req, res) => {
    const deleted = await CartItemService.deleteCartItem(req.params.id);

    if (!deleted) {
      return response.success(
        res,
        null,
        "Cart item không tồn tại hoặc đã bị xóa",
      );
    }

    return response.success(res, null, "Cart item deleted");
  });
  // Xóa toàn bộ giỏ hàng
  clearCart = asyncHandler(async (req, res) => {
    const { cart_id } = req.params;

    const result = await CartItemService.clearCart(cart_id);

    if (!result) {
      return response.success(res, null, "Giỏ hàng đã rỗng");
    }

    return response.success(res, null, "Đã xóa toàn bộ giỏ hàng");
  });
}

export default new CartItemController();
