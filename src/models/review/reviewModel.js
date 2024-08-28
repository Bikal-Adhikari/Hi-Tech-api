import reviewSchema from "./reviewSchema.js";

export const postNewReview = (obj) => {
  return reviewSchema(obj).save();
};

export const getReviewByUser = (userId) => {
  return reviewSchema.find({ userId });
};
export const getAllReview = (productId) => {
  return reviewSchema.find({ productId });
};
