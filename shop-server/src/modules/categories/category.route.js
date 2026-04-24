import express from "express";
import CategoryController from "./category.controller.js";

import {
  createCategoryValidator,
  updateCategoryValidator
} from "./category.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadCategory = createUploader("categories");

router.get("/", CategoryController.getCategories);

router.get("/:id", CategoryController.getCategoryById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadCategory.single("image"),
  createCategoryValidator,
  validate,
  CategoryController.createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadCategory.single("image"),
  updateCategoryValidator,
  validate,
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  CategoryController.deleteCategory
);

export default router;
