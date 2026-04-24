import CartService from "./cart.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class CartController {

  getCartByUser = asyncHandler(async (req, res) => {

    const cart = await CartService.getCartByUser(req.user.id);

    return response.success(res, cart);
  });

  getCartBySession = asyncHandler(async (req, res) => {

    const { session_key } = req.query;

    const cart = await CartService.getCartBySession(session_key);

    return response.success(res, cart);
  });

  deleteCart = asyncHandler(async (req, res) => {

    await CartService.deleteCart(req.params.id);

    return response.success(res, null, "Cart deleted");
  });
}

export default new CartController();
