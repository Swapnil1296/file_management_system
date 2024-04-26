const Joi = require("joi");
const ValidateBody = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        ? error.details.map((detail) => detail.message).join(", ")
        : error.message;

      return res.status(400).json({ status: 2, message: errorMessage });
    }

    if (!req.value) {
      req.value = {};
    }
    req.value["body"] = value;
    next();
  };
};

const schemas = {
  signUpSchema: Joi.object().keys({
    user_name: Joi.string()
      .trim()
      .required()
      .messages({ "any.required": "user name is required" }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .messages({ "any.required": "please provide a validate email address" }),

    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,30}$"))
      .min(6)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character.",
        "string.min": "Password must be at least 6 digits",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
      }),
  }),
  logInSchema: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .messages({ "any.required": "please provide a validate email address" }),

    password: Joi.string()
      //   .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,30}$"))
      .min(6)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 special character.",
        "string.min": "Password must be at least 6 digits",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
      }),
  }),
};

module.exports = {
  ValidateBody,
  schemas,
};
