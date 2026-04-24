import express from "express";
import PaymentController from "./payment.controller.js";

import {
  createPaymentValidator,
  updatePaymentValidator,
} from "./payment.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

/* VNPay */

router.post(
  "/vnpay/create",
  authMiddleware,
  PaymentController.createVNPayPayment,
);

router.get("/vnpay-return", PaymentController.vnpayReturn);

/* CRUD */

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin","customer"),
  PaymentController.getPayments,
);

router.get("/:id", authMiddleware, PaymentController.getPaymentById);

router.post(
  "/",
  authMiddleware,
  createPaymentValidator,
  validate,
  PaymentController.createPayment,
);

router.put(
  "/:id",
  authMiddleware,
  updatePaymentValidator,
  validate,
  PaymentController.updatePayment,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  PaymentController.deletePayment,
);

export default router;
