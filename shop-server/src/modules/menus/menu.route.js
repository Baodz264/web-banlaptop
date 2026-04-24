import express from "express";
import MenuController from "./menu.controller.js";

import {
  createMenuValidator,
  updateMenuValidator
} from "./menu.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", MenuController.getMenus);

router.get("/:id", MenuController.getMenuById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createMenuValidator,
  validate,
  MenuController.createMenu
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateMenuValidator,
  validate,
  MenuController.updateMenu
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  MenuController.deleteMenu
);

export default router;
