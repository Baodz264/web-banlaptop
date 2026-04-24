import express from "express";
import MessageController from "./message.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

import {
  createMessageValidator,
  updateMessageValidator
} from "./message.validator.js";

const router = express.Router();

// ============================
// GET ALL MESSAGES
// ============================
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  MessageController.getMessages
);

// ============================
// GET MESSAGE BY ID
// ============================
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  MessageController.getMessageById
);

// ============================
// CREATE MESSAGE
// ============================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "staff", "customer"),
  createMessageValidator,
  validate,
  MessageController.createMessage
);

// ============================
// UPDATE MESSAGE
// ============================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "staff"),
  updateMessageValidator,
  validate,
  MessageController.updateMessage
);

// ============================
// DELETE MESSAGE
// ============================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  MessageController.deleteMessage
);

export default router;
