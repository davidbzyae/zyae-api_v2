import Joi from "joi";

export const cookieTokensSchema = Joi.object({
  sid: Joi.string().required(),
  at: Joi.string().required(),
  rt: Joi.string().required(),
});
