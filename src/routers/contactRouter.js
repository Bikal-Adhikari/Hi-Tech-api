import express from "express";
import { userContactValidation } from "../middlewares/joiValidation.js";
import { insertContact } from "../models/contact/contactModel.js";
import { contactFormReply } from "../email/nodemailer.js";

const router = express.Router();

router.post("/", userContactValidation, async (req, res, next) => {
  try {
    const contactRequest = await insertContact(req.body);

    if (contactRequest?._id) {
      const { email, name, subject, message } = req.body;
      contactFormReply({
        email,
        name,
        subject,
        message,
      });
      return res.json({
        message: "Contact Service Requested Successfully",
        status: "success",
      });
    }
    return res.json({
      message: "Contact Request Failed",
      status: "failed",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
