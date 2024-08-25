import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.stripe_SecretKey);

router.post("/", async (req, res, next) => {
  try {
    const { amount, currency, paymentMethod } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      payment_method_types: [paymentMethod],
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
