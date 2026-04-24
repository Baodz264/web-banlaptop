import express from "express";
import PostController from "./post.controller.js";

import {
  createPostValidator,
  updatePostValidator
} from "./post.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadPost = createUploader("posts");

router.get("/", PostController.getPosts);

// ⭐ route slug
router.get("/slug/:slug", PostController.getPostBySlug);

router.get("/:id", PostController.getPostById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadPost.single("thumbnail"),
  createPostValidator,
  validate,
  PostController.createPost
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadPost.single("thumbnail"),
  updatePostValidator,
  validate,
  PostController.updatePost
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  PostController.deletePost
);

export default router;
