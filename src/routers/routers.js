import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import categoryRouter from "./categoryRouter.js";
import paymentRouter from "./paymentRouter.js";
import orderRouter from "./orderRouter.js";

export default [
  {
    path: "/api/v1/users",
    middlewares: [userRouter],
  },
  {
    path: "/api/v1/products",
    middlewares: [productRouter],
  },
  {
    path: "/api/v1/categories",
    middlewares: [categoryRouter],
  },
  {
    path: "/api/v1/payment",
    middlewares: [paymentRouter],
  },
  {
    path: "/api/v1/order",
    middlewares: [orderRouter],
  },
];
