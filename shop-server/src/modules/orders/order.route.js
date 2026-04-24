import express from "express";
import OrderController from "./order.controller.js";

import {
  createOrderValidator,
  updateOrderValidator
} from "./order.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, OrderController.getOrders);

router.get("/:id", authMiddleware, OrderController.getOrderById);

router.post(
  "/",
  authMiddleware,
  createOrderValidator,
  validate,
  OrderController.createOrder
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  updateOrderValidator,
  validate,
  OrderController.updateOrder
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  OrderController.deleteOrder
);

export default router;
