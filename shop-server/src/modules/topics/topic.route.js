import express from "express";
import TopicController from "./topic.controller.js";

import {
  createTopicValidator,
  updateTopicValidator,
} from "./topic.validator.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", TopicController.getTopics);

router.get("/:id", TopicController.getTopicById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTopicValidator,
  validate,
  TopicController.createTopic
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateTopicValidator,
  validate,
  TopicController.updateTopic
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  TopicController.deleteTopic
);

export default router;
