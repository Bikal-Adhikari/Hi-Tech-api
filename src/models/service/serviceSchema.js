import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    services: {
      type: String,
      required: true,
    },
    datePreferred: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Service", serviceSchema); //services
