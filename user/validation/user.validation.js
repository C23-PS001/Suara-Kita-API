const { check, validationResult } = require("express-validator");

exports.userRegisValidation = [
  check("email").notEmpty().withMessage("Email tidak boleh kosong"),
  check("email").isEmail().withMessage("Alamat email tidak valid!"),
  check("password").notEmpty().withMessage("Password tidak boleh kosong"),
];

exports.userLoginValidation = [
  check("email").notEmpty().withMessage("Email tidak boleh kosong"),
  check("email").isEmail().withMessage("Alamat email tidak valid!"),
  check("password").notEmpty().withMessage("Password tidak boleh kosong"),
];

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req).errors;

  const listErrors = [];
  if (errors.length !== 0) {
    errors.map((error) => {
      listErrors.push({
        error: true,
        key: error.param,
        message: error.msg,
      });
    });
  }

  if (listErrors.length !== 0) {
    return res.status(400).send(listErrors);
  }
  next();
};
