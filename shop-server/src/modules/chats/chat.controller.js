import ChatService from "./chat.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class ChatController {

  getChats = asyncHandler(async (req, res) => {

    const chats = await ChatService.getChats(req.query);

    return response.success(res, chats);
  });

  getChatById = asyncHandler(async (req, res) => {

    const chat = await ChatService.getChatById(req.params.id);

    return response.success(res, chat);
  });

  createChat = asyncHandler(async (req, res) => {

    const chat = await ChatService.createChat(req.body);

    return response.success(res, chat, "Chat created");
  });

  updateLastMessage = asyncHandler(async (req, res) => {

    const chat = await ChatService.updateLastMessage(req.params.id);

    return response.success(res, chat, "Chat updated");
  });

  deleteChat = asyncHandler(async (req, res) => {

    await ChatService.deleteChat(req.params.id);

    return response.success(res, null, "Chat deleted");
  });
}

export default new ChatController();
