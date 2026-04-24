import express from "express";
import { chatAIController } from "./aiChat.controller.js";

const router = express.Router();

router.post("/chat", chatAIController);

export default router;
