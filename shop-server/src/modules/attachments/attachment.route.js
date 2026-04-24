import express from "express";
import AttachmentController from "./attachment.controller.js";

import {
  createAttachmentValidator
} from "./attachment.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import createUploader from "../../middlewares/upload.middleware.js";

const router = express.Router();

const uploadAttachment = createUploader("chat");

/**
 * GET ALL ATTACHMENTS
 * admin + staff
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  AttachmentController.getAttachments
);

/**
 * GET ATTACHMENT BY ID
 * admin + staff
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  AttachmentController.getAttachmentById
);

/**
 * CREATE ATTACHMENT (UPLOAD FILE)
 * admin + staff + user
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  uploadAttachment.single("file"),
  createAttachmentValidator,
  validate,
  AttachmentController.createAttachment
);

/**
 * DELETE ATTACHMENT
 * admin only
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  AttachmentController.deleteAttachment
);

export default router;
