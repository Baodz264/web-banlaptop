import express from "express";
import PostProductController from "./postProduct.controller.js";

import { createPostProductValidator } from "./postProduct.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", PostProductController.getPostProducts);

router.get("/:post_id/:product_id", PostProductController.getPostProduct);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createPostProductValidator,
  validate,
  PostProductController.createPostProduct
);

router.delete(
  "/:post_id/:product_id",
  authMiddleware,
  roleMiddleware("admin"),
  PostProductController.deletePostProduct
);

export default router;
