import express from "express";
import { addNewOrder, getUserOrder } from "../models/order/orderModel.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { user, items, totalAmount, shippingAddress, billingAddress } =
      req.body;

    const newOrder = await addNewOrder({
      userId: user._id,
      items,
      totalAmount,
      shippingAddress,
      billingAddress,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;

    const orders = await getUserOrder(userId);

    res.status(201).json({
      status: "success",
      message: "Order fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
