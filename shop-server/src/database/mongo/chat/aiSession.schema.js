import mongoose from "mongoose";

const aiSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      index: true,
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "ai"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    memory: {
      viewedProducts: {
        type: [Number],
        default: [],
      },

      favoriteBrands: {
        type: [String],
        default: [],
      },

      priceRange: {
        min: Number,
        max: Number,
      },
    },
  },
  { timestamps: true }
);

// tối ưu query
aiSessionSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model("ai_sessions", aiSessionSchema);
