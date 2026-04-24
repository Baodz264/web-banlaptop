import express from "express";
import SettingController from "./setting.controller.js";

import {
  createSettingValidator,
  updateSettingValidator,
} from "./setting.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", SettingController.getSettings);

router.get("/:id", SettingController.getSettingById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSettingValidator,
  validate,
  SettingController.createSetting
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSettingValidator,
  validate,
  SettingController.updateSetting
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  SettingController.deleteSetting
);

export default router;
