import orderSchema from "./orderSchema.js";

export const addNewOrder = (obj) => {
  return orderSchema(obj).save();
};

export const getUserOrder = (userId) => {
  return orderSchema.find({ userId: userId });
};
