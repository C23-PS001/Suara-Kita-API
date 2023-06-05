const { check, validationResult } = require('express-validator')


exports.userRegisValidation = [
    check('email').notEmpty().withMessage('Email tidak boleh kosong'),
    check('email').isEmail().withMessage('Alamat email tidak valid!'),
    check('password').notEmpty().withMessage('Password tidak boleh kosong')
]

exports.userLoginValidation = [
  check("email").notEmpty().withMessage("Email tidak boleh kosong"),
  check("email").isEmail().withMessage("Alamat email tidak valid!"),
  check("password").notEmpty().withMessage("Password tidak boleh kosong"),
];

exports.uploadFotoValidation = (req, res, next) => {
  const uploadErr = []
  const acceptedType = ["image/png", "image/jpg", "image/jpeg"];

  switch (true) {
    case !req.files:
      uploadErr.push({
        error: true,
        key: "uploadFotoKtp",
        message: "Foto tidak boleh kosong",
      });
      break;

    case !acceptedType.includes(req.files.fotoKtp.mimetype):
      uploadErr.push({
        error: true,
        key: "uploadFotoKtp",
        message: "Harap menggunakan tipe file png, jpg, atau jpeg",
      });
      break;
  }

  req.uploadErr = uploadErr

  next()
}

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req).errors;
  const uploadErr = req.uploadErr

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

  // if (uploadErr !== undefined && uploadErr.length !== 0){
  //   listErrors.push(uploadErr[0])
  // }

  if (listErrors.length !== 0) {
    return res.status(400).send(listErrors);
  }
  next();
};