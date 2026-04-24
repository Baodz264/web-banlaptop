import express from "express";
import VariantValueController from "./variantValue.controller.js";
import VariantValueService from "./variantValue.service.js";

import { createVariantValueValidator } from "./variantValue.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

const router = express.Router();

// ================= GET =================
router.get(
  "/variant/:variant_id",
  VariantValueController.getByVariantId
);

// ================= CREATE 1 =================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createVariantValueValidator,
  validate,
  VariantValueController.create
);

// 🔥 ================= BULK CREATE =================
router.post(
  "/bulk",
  authMiddleware,
  roleMiddleware("admin"),
  asyncHandler(async (req, res) => {
    const result = await VariantValueService.createMany(req.body);

    return response.success(res, result, "Bulk created");
  })
);

// ================= DELETE =================
router.delete(
  "/variant/:variant_id",
  authMiddleware,
  roleMiddleware("admin"),
  VariantValueController.deleteByVariantId
);

export default router;