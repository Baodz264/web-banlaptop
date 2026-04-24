import express from "express";
import CartController from "./cart.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  sessionCartValidator
} from "./cart.validator.js";

const router = express.Router();

router.get(
  "/user",
  authMiddleware,
  CartController.getCartByUser
);

router.get(
  "/session",
  sessionCartValidator,
  validate,
  CartController.getCartBySession
);

router.delete(
  "/:id",
  authMiddleware,
  CartController.deleteCart
);

export default router;
