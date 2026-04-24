import AttachmentService from "./attachment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import response from "../../utils/response.js";

class AttachmentController {

  getAttachments = asyncHandler(async (req, res) => {

    const attachments = await AttachmentService.getAttachments(req.query.message_id);

    return response.success(res, attachments);
  });

  getAttachmentById = asyncHandler(async (req, res) => {

    const attachment = await AttachmentService.getAttachmentById(req.params.id);

    return response.success(res, attachment);
  });

  createAttachment = asyncHandler(async (req, res) => {

    const data = { ...req.body };

    if (req.file) {
      data.file_url = `/uploads/chat/${req.file.filename}`;
    }

    const attachment = await AttachmentService.createAttachment(data);

    return response.success(res, attachment, "Attachment created");
  });

  deleteAttachment = asyncHandler(async (req, res) => {

    await AttachmentService.deleteAttachment(req.params.id);

    return response.success(res, null, "Attachment deleted");
  });

}

export default new AttachmentController();
