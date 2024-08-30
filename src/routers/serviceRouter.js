import express from "express";
import { userServiceValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

router.post("/", userServiceValidation, (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
});

export default router;
