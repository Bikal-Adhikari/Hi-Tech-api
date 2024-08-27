import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
