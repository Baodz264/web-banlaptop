import express from "express";
import UserAddressController from "./address.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  createAddressValidator,
  updateAddressValidator
} from "./address.validator.js";

const router = express.Router();

// ADMIN xem tất cả địa chỉ
router.get(
  "/admin/all",
  authMiddleware,
  UserAddressController.getAllAddresses
);

// User xem địa chỉ của mình
router.get(
  "/",
  authMiddleware,
  UserAddressController.getAddresses
);

router.get(
  "/:id",
  authMiddleware,
  UserAddressController.getAddressById
);

router.post(
  "/",
  authMiddleware,
  createAddressValidator,
  validate,
  UserAddressController.createAddress
);

router.put(
  "/:id",
  authMiddleware,
  updateAddressValidator,
  validate,
  UserAddressController.updateAddress
);

router.delete(
  "/:id",
  authMiddleware,
  UserAddressController.deleteAddress
);

export default router;
