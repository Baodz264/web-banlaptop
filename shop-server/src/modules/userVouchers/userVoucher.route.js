import express from "express";
import UserVoucherController from "./userVoucher.controller.js";

import {
  createUserVoucherValidator,
  updateUserVoucherValidator
} from "./userVoucher.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", UserVoucherController.getUserVouchers);

router.get("/:id", UserVoucherController.getUserVoucherById);

router.post(
  "/",
  authMiddleware,
  createUserVoucherValidator,
  validate,
  UserVoucherController.createUserVoucher
);

router.put(
  "/:id",
  authMiddleware,
  updateUserVoucherValidator,
  validate,
  UserVoucherController.updateUserVoucher
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  UserVoucherController.deleteUserVoucher
);

export default router;
