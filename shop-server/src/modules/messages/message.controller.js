import MessageService from "./message.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class MessageController {

  getMessages = asyncHandler(async (req, res) => {

    const messages = await MessageService.getMessages(req.query);

    return response.success(res, messages);
  });

  getMessageById = asyncHandler(async (req, res) => {

    const message = await MessageService.getMessageById(req.params.id);

    return response.success(res, message);
  });

  createMessage = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const message = await MessageService.createMessage(data);

    return response.success(res, message, "Message created");
  });

  updateMessage = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    const message = await MessageService.updateMessage(
      req.params.id,
      data
    );

    return response.success(res, message, "Message updated");
  });

  deleteMessage = asyncHandler(async (req, res) => {

    await MessageService.deleteMessage(req.params.id);

    return response.success(res, null, "Message deleted");
  });
}

export default new MessageController();
