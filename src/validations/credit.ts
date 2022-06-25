import Joi from "joi";
import { ICredit, ICreditValidate } from '../utils/interface';
import objectId from "./common";

export const creditValidation = (credit: ICredit) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
  });
  return schema.validate(credit);
};


export const validateId = (credit: ICreditValidate) => {
  const schema = Joi.object({
    creditId: objectId.messages({
      "any.required": "Credit id is required.",
      "string.length": "Credit id must be a valid uuid.",
    }),
  });
  return schema.validate(credit);
};

