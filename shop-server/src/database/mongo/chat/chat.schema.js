import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    customer_id: {
      type: Number,
      required: true,
      index: true,
    },
    admin_id: {
      type: Number,
      required: true,
      index: true,
    },
    last_message_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);


export default mongoose.model("Chat", chatSchema);
