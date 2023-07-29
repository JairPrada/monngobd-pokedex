import * as Joi from "joi";

export const JoiValidationSchema = Joi.object({
  MONGO_STRING_CONNECTION: Joi.required(),
  PORT: Joi.number().default(30005),
});
