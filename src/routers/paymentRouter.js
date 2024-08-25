import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.stripe_SecretKey);

router.get("/config", async (req, res, next) => {
  try {
    res.send({
      stripePublishableKey: process.env.stripe_PublishableKey,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create-payment-intent", async (req, res, next) => {
  try {
    const { amount, currency, paymentMethod } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
