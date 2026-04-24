import express from "express";
import InventoryController from "./inventory.controller.js";

import {
  createInventoryValidator,
  updateInventoryValidator
} from "./inventory.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", InventoryController.getInventories);

router.get("/:id", InventoryController.getInventoryById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff"),
  createInventoryValidator,
  validate,
  InventoryController.createInventory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  updateInventoryValidator,
  validate,
  InventoryController.updateInventory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  InventoryController.deleteInventory
);

export default router;
