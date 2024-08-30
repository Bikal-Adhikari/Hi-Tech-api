import express from "express";
import { userServiceValidation } from "../middlewares/joiValidation.js";
import { serviceRequestedNotification } from "../email/nodemailer.js";
import { insertService } from "../models/service/serviceModel.js";

const router = express.Router();

router.post("/", userServiceValidation, async (req, res, next) => {
  try {
    const serviceRequest = await insertService(req.body);

    if (serviceRequest?._id) {
      const { email, name, services, ...rest } = req.body;
      serviceRequestedNotification({
        email,
        name,
        services,
      });
      return res.json({
        message: "Service Requested Successfully",
        status: "success",
      });
    }
    return res.json({
      message: "Service Request Failed",
      status: "failed",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
