import Joi from 'joi';
import { IUser, ILogin, IBeneficiary } from '../utils/interface';
import objectId from "./common";

export const validateSignup = (user: IUser) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
  });
  return schema.validate(user);
};

export const validateLogin = (login: ILogin) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(login);
};

export const beneficiaryValidation = (beneficiary: IBeneficiary) => {
  const schema = Joi.object({
    beneficiaryId: objectId.messages({
      "any.required": "Beneficiary id is required.",
      "string.length": "Beneficiary id must be a valid mongoose id.",
    }),
  });
  return schema.validate(beneficiary);
};
