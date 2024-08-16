import CategorySchema from "./categorySchema.js";

export const getActiveCategories = () => {
  return CategorySchema.find({ status: "active" });
};

export const getACategory = (_id) => {
  return CategorySchema.findById(_id);
};