import AttachmentRepository from "./attachment.repository.js";

class AttachmentService {

  static async getAttachments(message_id) {
    return await AttachmentRepository.findByMessage(message_id);
  }

  static async getAttachmentById(id) {

    const attachment = await AttachmentRepository.findById(id);

    if (!attachment) {
      throw new Error("Không tìm thấy tệp đính kèm");
    }

    return attachment;
  }

  static async createAttachment(data) {
    return await AttachmentRepository.create(data);
  }

  static async deleteAttachment(id) {

    const attachment = await AttachmentRepository.findById(id);

    if (!attachment) {
      throw new Error("Không tìm thấy tệp đính kèm");
    }

    await AttachmentRepository.delete(id);

    return true;
  }

}

export default AttachmentService;
