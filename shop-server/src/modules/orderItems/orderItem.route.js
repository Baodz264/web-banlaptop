import express from "express";

import OrderItemController from "./orderItem.controller.js";

import {
  createOrderItemValidator,
  updateOrderItemValidator
} from "./orderItem.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", OrderItemController.getOrderItems);

router.get("/:id", OrderItemController.getOrderItemById);

router.post(
  "/",
  authMiddleware,
  createOrderItemValidator,
  validate,
  OrderItemController.createOrderItem
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  updateOrderItemValidator,
  validate,
  OrderItemController.updateOrderItem
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  OrderItemController.deleteOrderItem
);

export default router;
