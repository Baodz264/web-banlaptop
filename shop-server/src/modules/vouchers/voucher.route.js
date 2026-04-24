import express from "express";
import VoucherController from "./voucher.controller.js";

import {
  createVoucherValidator,
  updateVoucherValidator
} from "./voucher.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", VoucherController.getVouchers);

router.get("/:id", VoucherController.getVoucherById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createVoucherValidator,
  validate,
  VoucherController.createVoucher
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateVoucherValidator,
  validate,
  VoucherController.updateVoucher
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  VoucherController.deleteVoucher
);

export default router;
