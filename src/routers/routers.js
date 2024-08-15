import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";

export default [
  {
    path: "/api/v1/users",
    middlewares: [userRouter],
  },
  {
    path: "/api/v1/products",
    middlewares: [productRouter],
  },
];
