import ProductSchema from "./productSchema.js";

export const getActiveProducts = () => {
  return ProductSchema.find({ status: "active" });
};

export const getAProduct = (_id) => {
  return ProductSchema.findById(_id);
};
