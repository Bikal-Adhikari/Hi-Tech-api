import express from "express";
import {
  addNewOrder,
  getSingleOrder,
  getUserOrder,
  updateOrderStatus,
} from "../models/order/orderModel.js";
const router = express.Router();

// Function to calculate and return the correct status based on the order age
const calculateOrderStatus = (orderAgeInDays) => {
  if (orderAgeInDays >= 1 && orderAgeInDays <= 5) {
    return "On the way";
  } else if (orderAgeInDays >= 6 && orderAgeInDays <= 9) {
    return "Coming your way";
  } else if (orderAgeInDays === 10) {
    return "Deliver today";
  } else if (orderAgeInDays > 10) {
    return "Delivered";
  } else {
    return "Processing";
  }
};

// Route to add a new order
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

// Route to get all user orders with automatic status updates
router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const currentDate = new Date();

    const orders = await getUserOrder(userId);

    // Loop through each order and update the status if necessary
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const orderAgeInDays = Math.floor(
          (currentDate - new Date(order.createdAt)) / (1000 * 60 * 60 * 24)
        );

        const newStatus = calculateOrderStatus(orderAgeInDays);

        if (order.status !== newStatus) {
          // Update the status in the database
          order.status = newStatus;
          await updateOrderStatus(order._id, { status: newStatus });
        }

        return order;
      })
    );

    res.status(200).json({
      status: "success",
      message: "Orders fetched and updated successfully",
      orders: updatedOrders,
    });
  } catch (error) {
    next(error);
  }
});

// Route to get a single order by ID
router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const order = await getSingleOrder(_id);

    res.status(200).json({
      status: "success",
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
