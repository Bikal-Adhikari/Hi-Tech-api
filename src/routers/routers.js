import userRouter from "./userRouter.js";
import productRouter from "./productRouter.js";
import categoryRouter from "./categoryRouter.js";

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
];
