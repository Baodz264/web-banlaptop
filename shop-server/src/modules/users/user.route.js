import express from "express";
import UserController from "./user.controller.js";

import {
  updateProfileValidator,
  createUserValidator,
  updateUserValidator,
} from "./user.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadUser = createUploader("users");

/* PROFILE */

router.get(
  "/profile",
  authMiddleware,
  UserController.getProfile
);

router.put(
  "/profile",
  authMiddleware,
  uploadUser.single("avatar"),
  updateProfileValidator,
  validate,
  UserController.updateProfile
);

/* GET ADMINS FOR CHAT */

router.get(
  "/admins",
  authMiddleware,
  UserController.getAdmins
);

/* ADMIN */

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin","staff","customer"),
  UserController.getUsers
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff","customer"),
  UserController.getUserById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadUser.single("avatar"),
  createUserValidator,
  validate,
  UserController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadUser.single("avatar"),
  updateUserValidator,
  validate,
  UserController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  UserController.deleteUser
);

export default router;
