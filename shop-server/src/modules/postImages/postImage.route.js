import express from "express";
import PostImageController from "./postImage.controller.js";

import {
  createPostImageValidator,
  updatePostImageValidator
} from "./postImage.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadPostImage = createUploader("posts");

router.get("/", PostImageController.getPostImages);

router.get("/:id", PostImageController.getPostImageById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadPostImage.single("image"),
  createPostImageValidator,
  validate,
  PostImageController.createPostImage
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadPostImage.single("image"),
  updatePostImageValidator,
  validate,
  PostImageController.updatePostImage
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  PostImageController.deletePostImage
);

export default router;
