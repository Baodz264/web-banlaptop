import express from "express";
import ProductController from "./product.controller.js";

import {
  createProductValidator,
  updateProductValidator,
  bulkProductValidator
} from "./product.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadProduct = createUploader("products");

router.get("/", ProductController.getProducts);

router.get("/:id", ProductController.getProductById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadProduct.single("thumbnail"),
  createProductValidator,
  validate,
  ProductController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadProduct.single("thumbnail"),
  updateProductValidator,
  validate,
  ProductController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductController.deleteProduct
);

//thêm bằng excel
router.post(
  "/bulk",
  authMiddleware,
  roleMiddleware("admin"),
  bulkProductValidator,
  validate,
  ProductController.createBulkProducts
);

export default router;
