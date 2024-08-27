import orderSchema from "./orderSchema.js";

export const addNewOrder = (obj) => {
  return orderSchema(obj).save();
};

export const getUserOrder = (userId) => {
  return orderSchema.find({ userId: userId });
};
export const getSingleOrder = (_id) => {
  return orderSchema.findById(_id);
};

export const updateOrderStatus = (_id) => {
  return orderSchema.findByIdAndUpdate(_id, obj);
};
