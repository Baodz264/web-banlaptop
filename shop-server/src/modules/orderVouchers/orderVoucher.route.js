import express from "express";
import OrderVoucherController from "./orderVoucher.controller.js";

import {
  createOrderVoucherValidator,
  updateOrderVoucherValidator
} from "./orderVoucher.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", OrderVoucherController.getOrderVouchers);

router.get("/:id", OrderVoucherController.getOrderVoucherById);

router.post(
  "/",
  authMiddleware,
  createOrderVoucherValidator,
  validate,
  OrderVoucherController.createOrderVoucher
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrderVoucherValidator,
  validate,
  OrderVoucherController.updateOrderVoucher
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  OrderVoucherController.deleteOrderVoucher
);

export default router;
