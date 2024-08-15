import express from "express";
import {
  getActiveProducts,
  getAProduct,
} from "../models/product/productModel.js";
const router = express.Router();

// Route to get all active products
router.get("/", async (req, res, next) => {
  try {
    const products = await getActiveProducts();
    res.json({
      status: "success",
      message: "",
      products,
    });
  } catch (error) {
    next(error);
  }
});

// Route to get a specific product by ID (optional)
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const product = await getAProduct(_id);

    if (product.status !== "active") {
      return res.status(404).json({
        status: "error",
        message: "Product not found or inactive",
      });
    }

    res.json({
      status: "success",
      message: "",
      product,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
