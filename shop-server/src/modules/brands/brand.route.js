import express from "express";
import BrandController from "./brand.controller.js";

import {
  createBrandValidator,
  updateBrandValidator
} from "./brand.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadBrand = createUploader("brands");

router.get("/", BrandController.getBrands);

router.get("/:id", BrandController.getBrandById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadBrand.single("logo"),
  createBrandValidator,
  validate,
  BrandController.createBrand
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadBrand.single("logo"),
  updateBrandValidator,
  validate,
  BrandController.updateBrand
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  BrandController.deleteBrand
);

export default router;
