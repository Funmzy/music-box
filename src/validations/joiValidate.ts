import { IUser } from "../types/types";
import Joi from "joi";
import JoiDate from "@joi/date";

const joi = Joi.extend(JoiDate);

export const validateUser = function (obj: IUser): Record<string, any> {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required(),
    password: Joi.string()
      .min(6)
      .error(new Error("password is too short"))
      .required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    dateOfBirth: joi
      .date()
      .format(["YYYY/MM/DD"])
      .error(new Error("Invalid date. Date format 'YYYY/MM/DD' "))
      .required(),
    gender: Joi.any()
      .valid("M", "Male", "Female", "F", "Others")
      .error(new Error("Gender should be Male or M or Female or F"))
      .required(),
  });
  return schema.validate(obj);
};

export const validateUpdatedUser = function (obj: IUser): Record<string, any> {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    dateOfBirth: joi
      .date()
      .format(["YYYY/MM/DD"])
      .error(new Error("Date format 'YYYY / MM / DD")),
    gender: Joi.any()
      .valid("M", "Male", "Female", "F", "Others")
      .error(new Error("Gender should be Male or M or Female or F")),
  });
  return schema.validate(obj);
};
