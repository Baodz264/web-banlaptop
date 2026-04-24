import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number, 
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: String,
    type: {
      type: String,
      enum: ["order", "promotion", "system", "chat", "wishlist"],
      default: "system",
    },
    ref_id: {
      type: Number,
      default: null,
    },
    is_read: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Notification", notificationSchema);
