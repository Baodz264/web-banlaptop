import express from "express";
import WarrantyController from "./warranty.controller.js";

import {
  createWarrantyValidator,
  updateWarrantyValidator
} from "./warranty.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", WarrantyController.getWarranties);

router.get("/:id", WarrantyController.getWarrantyById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createWarrantyValidator,
  validate,
  WarrantyController.createWarranty
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateWarrantyValidator,
  validate,
  WarrantyController.updateWarranty
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  WarrantyController.deleteWarranty
);

export default router;
