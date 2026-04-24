import express from "express";
import WishlistController from "./wishlist.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { addWishlistValidator } from "./wishlist.validator.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  WishlistController.getWishlist
);

router.post(
  "/",
  authMiddleware,
  addWishlistValidator,
  validate,
  WishlistController.addWishlist
);

router.delete(
  "/:product_id",
  authMiddleware,
  WishlistController.removeWishlist
);

export default router;
