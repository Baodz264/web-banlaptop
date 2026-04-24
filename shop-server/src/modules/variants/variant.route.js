import express from "express";
import VariantController from "./variant.controller.js";

import {
  createVariantValidator,
  updateVariantValidator,
} from "./variant.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadVariant = createUploader("variants");


router.get("/", VariantController.getAllVariants);

router.get("/product/:product_id", VariantController.getVariantsByProduct);

router.get("/:id", VariantController.getVariantById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadVariant.single("image"),
  createVariantValidator,
  validate,
  VariantController.createVariant,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadVariant.single("image"),
  updateVariantValidator,
  validate,
  VariantController.updateVariant,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  VariantController.deleteVariant,
);

export default router;
