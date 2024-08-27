import express from "express";
import { addNewOrder, getUserOrder, updateOrderStatus } from "../models/order/orderModel.js";
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
    const currentDate = new Date();

    const orders = await getUserOrder(userId);

    const updatedOrders = orders.map((order) => {
      const orderAgeInDays = Math.floor(
        (currentDate - new Date(order.createdAt)) / (1000 * 60 * 60 * 24)
      );

      if (orderAgeInDays > 10) {
        // If order is older than 10 days, set status to 'Delivered'
        if (order.status !== "Delivered") {
          order.status = "Delivered";
        }
      }
      return order;
    });

    if (updatedOrders?._id) {
      const orders = await updateOrderStatus(_id, updatedOrders);
      return orders;
    }

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
