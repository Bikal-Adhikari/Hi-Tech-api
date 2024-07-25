import express from "express";
import { newUserValidation } from "../middlewares/joiValidation.js";
import { insertUser } from "../models/user/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/bcrypt.js";
import { emailVerificationMail } from "../email/nodemailer.js";
import { insertSession } from "../models/session/sessionModel.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
  } catch (error) {}
});

router.post("/", newUserValidation, async (req, res, next) => {
  try {
    // encrypt password
    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);

    if (user?._id) {
      // create unique url and add in the database
      const token = uuidv4();
      const obj = {
        token,
        associate: user.email,
        type: "email-verification",
      };

      const result = await insertSession(obj);
      if (result?._id) {
        //process for sending email

        emailVerificationMail({
          email: user.email,
          fName: user.fName,
          url:
            process.env.FE_ROOT_URL + `/verify-user?c=${token}&e=${user.email}`,
        });
        return res.json({
          status: "success",
          message:
            "We have send you an email with insturction to verify your  account. Pelase chekc email/junk to verify your account",
        });
      }
    }

    res.json({
      status: "error",
      message: "Error Unable to create an account, Contact administration",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
