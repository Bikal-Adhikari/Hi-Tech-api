import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending", // Initial status
        "On the way", // 1-5 days
        "Coming your way", // 6-9 days
        "Deliver today", // 10 days
        "Delivered", // Beyond 10 days
      ],
      default: "Pending",
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
