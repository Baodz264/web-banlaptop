import express from "express";
import ProductBundleController from "./bundle.controller.js";

import {
  createBundleValidator,
  updateBundleValidator
} from "./bundle.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", ProductBundleController.getBundles);

router.get("/:id", ProductBundleController.getBundleById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createBundleValidator,
  validate,
  ProductBundleController.createBundle
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateBundleValidator,
  validate,
  ProductBundleController.updateBundle
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  ProductBundleController.deleteBundle
);

export default router;
