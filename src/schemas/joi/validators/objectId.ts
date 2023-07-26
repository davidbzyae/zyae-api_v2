import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const validateObjectId = (
  value: string,
  helper: Joi.CustomHelpers<string>
) => {
  return !isValidObjectId(value)
    ? helper.message({
        custom: `"${helper.state.path}" must be a valid ObjectId`,
      })
    : true;
};
