import express from "express";
import InventoryLogController from "./inventoryLog.controller.js";

import { createInventoryLogValidator } from "./inventoryLog.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", InventoryLogController.getLogs);

router.get("/:id", InventoryLogController.getLogById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff"),
  createInventoryLogValidator,
  validate,
  InventoryLogController.createLog
);

export default router;
