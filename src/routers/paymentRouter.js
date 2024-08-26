import express from "express";
import Stripe from "stripe";
import { addNewOrder } from "../models/order/orderModel.js";

const router = express.Router();
const stripe = new Stripe(process.env.stripe_SecretKey);

router.get("/config", async (req, res, next) => {
  try {
    res.send({
      publishableKey: process.env.stripe_PublishableKey,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create-payment-intent", async (req, res, next) => {
  try {
    const { totalAmount, user, items, shippingAddress, billingAddress } =
      req.body; // Retrieve amount from request body

    const amount = totalAmount;
    if (!amount) {
      return res.status(400).send({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit (cents for USD)
      currency: "AUD",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user?._id,
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
      },
    });

    const order = await addNewOrder({
      userId: user._id,
      items,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentIntentId: paymentIntent.id,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
