import express from "express";
import {
  getAllReview,
  getReviewByUser,
  postNewReview,
} from "../models/review/reviewModel.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { userId, productId, rating, review } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({
        status: "fail",
        message: "User ID and Product ID are required",
      });
    }

    const newReview = await postNewReview({
      userId,
      productId,
      rating,
      review,
    });
    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const { productId } = req.query;
    const reviews = await getAllReview(productId);
   
    res.status(200).json({
      status: "success",
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is required",
      });
    }

    const reviews = await getReviewByUser(userId);
    res.status(200).json({
      status: "success",
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
