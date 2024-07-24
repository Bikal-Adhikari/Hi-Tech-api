import sessionSchema from "./sessionSchema.js";

export const insertSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};
