import contactSchema from "./contactSchema.js";

export const insertContact = (contactObj) => {
  return contactSchema(contactObj).save();
};
