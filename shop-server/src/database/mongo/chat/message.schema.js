import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender_id: {
      type: Number, 
      required: true,
      index: true,
    },
    message: {
      type: String,
      trim: true,
    },
    message_type: {
      type: String,
      enum: ["text", "image", "icon", "file", "system"],
      default: "text",
    },
    reply_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    is_recalled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);


export default mongoose.model("Message", messageSchema);
