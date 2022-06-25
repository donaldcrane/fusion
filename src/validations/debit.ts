import Joi from "joi";
import { IDebit, IDebitValidate } from '../utils/interface';
import objectId from "./common";

export const debitValidation = (debit: IDebit) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    amount: Joi.number().required(),
  });
  return schema.validate(debit);
};


export const validateId = (debit: IDebitValidate) => {
  const schema = Joi.object({
    debitId: objectId.messages({
      "any.required": "Debit id is required.",
      "string.length": "Debit id must be a valid mongoose id.",
    }),
  });
  return schema.validate(debit);
};

