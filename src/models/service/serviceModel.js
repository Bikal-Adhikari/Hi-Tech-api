import serviceSchema from "./serviceSchema.js";

export const insertService = (serviceObj) => {
  return serviceSchema(serviceObj).save();
};
