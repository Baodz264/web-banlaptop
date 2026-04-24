import express from "express";
import VoucherApplyController from "./voucherApply.controller.js";

import {
  createVoucherApplyValidator,
  updateVoucherApplyValidator
} from "./voucherApply.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", VoucherApplyController.getVoucherApplies);

router.get("/:id", VoucherApplyController.getVoucherApplyById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createVoucherApplyValidator,
  validate,
  VoucherApplyController.createVoucherApply
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateVoucherApplyValidator,
  validate,
  VoucherApplyController.updateVoucherApply
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  VoucherApplyController.deleteVoucherApply
);

export default router;
