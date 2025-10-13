const { check, validationResult } = require("express-validator");

exports.signupRules = () => [
  check("name", "Name is required").notEmpty(),
  check("lastname", "Last name is required").notEmpty(),
  check("email", "Email is required").notEmpty(),
  check("email", "Invalid email format").isEmail(),
  check("phonenumber", "Phone number is required").notEmpty(),
  check("password", "Password must be between 8 and 20 characters").isLength({
    min: 8,
    max: 20,
  }),
];

exports.loginRules = () => [
  check("email", "Email is required").notEmpty(),
  check("email", "Invalid email format").isEmail(),
  check("password", "Password must be between 8 and 20 characters").isLength({
    min: 8,
    max: 20,
  }),
];

exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array().map((el) => ({ msg: el.msg })),
    });
  }
  next();
};
