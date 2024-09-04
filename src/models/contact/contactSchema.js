import mongoose from "mongoose";
const contactSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
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

export default mongoose.model("Contact", contactSchema); //contact
