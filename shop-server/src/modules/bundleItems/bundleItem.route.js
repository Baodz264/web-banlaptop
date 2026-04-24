import express from "express";
import ProductBundleItemController from "./bundleItem.controller.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import { createBundleItemValidator } from "./bundleItem.validator.js";

const router = express.Router();

router.get("/", ProductBundleItemController.getItems);

router.get("/bundle/:bundle_id", ProductBundleItemController.getItemsByBundle);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createBundleItemValidator,
  validate,
  ProductBundleItemController.createItem
);

router.delete(
  "/:bundle_id/:variant_id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductBundleItemController.deleteItem
);

export default router;
