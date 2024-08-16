import express from "express";
import {
  getACategory,
  getActiveCategories,
} from "../models/category/categoryModel.js";

const router = express.Router();

// Route to get all active categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await getActiveCategories();
    res.json({
      status: "success",
      message: "",
      categories,
    });
  } catch (error) {
    next(error);
  }
});

// Route to get a specific product by ID (optional)
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const category = await getACategory(_id);

    if (category.status !== "active") {
      return res.status(404).json({
        status: "error",
        message: "category not found or inactive",
      });
    }

    res.json({
      status: "success",
      message: "",
      category,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
