import express from "express";
import CartItemController from "./cartItem.controller.js";

import {
  addCartItemValidator,
  updateCartItemValidator
} from "./cartItem.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/cart/:cart_id",
  authMiddleware,
  CartItemController.getCartItems
);

router.post(
  "/",
  authMiddleware,
  addCartItemValidator,
  validate,
  CartItemController.addToCart
);

router.put(
  "/:id",
  authMiddleware,
  updateCartItemValidator,
  validate,
  CartItemController.updateCartItem
);

router.delete(
  "/:id",
  authMiddleware,
  CartItemController.deleteCartItem
);

router.delete(
  "/cart/clear/:cart_id",
  authMiddleware,
  CartItemController.clearCart
);

export default router;
