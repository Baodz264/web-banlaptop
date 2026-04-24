import express from "express";
import OrderStatusLogController from "./orderStatusLog.controller.js";

import { createOrderStatusLogValidator } from "./orderStatusLog.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, OrderStatusLogController.getLogs);

router.get("/:id", authMiddleware, OrderStatusLogController.getLogById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "customer","staff"),
  createOrderStatusLogValidator,
  validate,
  OrderStatusLogController.createLog
);

export default router;
