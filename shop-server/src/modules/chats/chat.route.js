import express from "express";
import ChatController from "./chat.controller.js";

import { createChatValidator } from "./chat.validator.js";
import validate from "../../middlewares/validate.middleware.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  ChatController.getChats
);

router.get(
  "/:id",
  authMiddleware,
  ChatController.getChatById
);

router.post(
  "/",
  authMiddleware,
  createChatValidator,
  validate,
  ChatController.createChat
);

router.put(
  "/:id/last-message",
  authMiddleware,
  ChatController.updateLastMessage
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin","staff"),
  ChatController.deleteChat
);

export default router;
