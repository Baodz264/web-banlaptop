import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      index: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      enum: ["image", "video", "file"],
      required: true,
    },
    file_size: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);


export default mongoose.model("Attachment", attachmentSchema);
