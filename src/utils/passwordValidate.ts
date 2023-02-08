import Joi from "joi";

// validation for change password
export const validateUserPassword = function (data: {
  password: string;
}): Joi.ValidationResult {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .error(() => new Error("invalid password format")),
  });
  return schema.validate(data);
};
