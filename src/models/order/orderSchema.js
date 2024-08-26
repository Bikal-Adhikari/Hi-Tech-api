import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
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
