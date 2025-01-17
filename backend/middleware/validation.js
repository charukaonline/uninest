const { body } = require("express-validator");

exports.validateSignup = [
  body("email").isEmail().normalizeEmail(),
  body("username").trim().isLength({ min: 3 }),
  body("password").isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.validateSignin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
