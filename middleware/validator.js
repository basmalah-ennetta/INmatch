const { check, validationResult } = require("express-validator");

exports.signupRules = () => [
  check("name", "name is required").notEmpty(),
  check("lastname", "lastname is required").notEmpty(),
  check("email", "name is required").notEmpty(),
  check("phonenumber", "phonenumber is required").notEmpty(),
  check("email", "check email again").isEmail(),
  check("password","password must be between 8 character and 20 character").isLength({
    min: 8,
    max: 20,
  }),
];

exports.loginRules = () => [
  check("email", "name is required").notEmpty(),
  check("email", "check email again").isEmail(),
  check(
    "password",
    "password incorrect"
  ).isLength({
    min: 8,
    max: 20,
  }),
];
exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array().map((el) => ({
        msg: el.msg,
      })),
    });
  }
  next();
};