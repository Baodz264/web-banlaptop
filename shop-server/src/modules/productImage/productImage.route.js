import express from "express";
import ProductImageController from "./productImage.controller.js";

import {
  createProductImageValidator
} from "./productImage.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadProductImage = createUploader("products");

router.get(
  "/product/:product_id",
  ProductImageController.getImages
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadProductImage.single("image"),
  createProductImageValidator,
  validate,
  ProductImageController.createImage
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductImageController.deleteImage
);

export default router;
