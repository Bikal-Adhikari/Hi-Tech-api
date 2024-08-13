import userSchema from "./userSchema.js";

export const insertUser = (userObj) => {
  return userSchema(userObj).save();
};

export const updateUser = (filter, obj) => {
  return userSchema.findOneAndUpdate(filter, obj);
};

export const getAUser = (filter) => {
  return userSchema.findOne(filter);
};
export const getAUserById = (_id) => {
  return userSchema.findById(_id);
};

export const updateUserById = (_id, obj) => {
  return userSchema.findByIdAndUpdate(_id, obj, { new: true });
};

export const updateUserPassword = (filter, password) => {
  return userSchema.findOneAndUpdate(filter, password);
};
