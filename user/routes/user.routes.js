const UserController = require("../controller/user.controller");
const validation = require("../validation/user.validation");
// const multer = require('multer')
// const storage = multer.diskStorage({
//   destination: "./fotoKtp",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

module.exports = function (app) {
  app.post(
    "/user/register",
    validation.userRegisValidation,
    validation.runValidation,
    UserController.register
  );
  app.post(
    "/user/login",
    validation.userLoginValidation,
    validation.runValidation,
    UserController.login
  );

  // app.post(
  //   '/test/upload',
  //    upload.single('fotoKtp'),
  //   UserController.uploadFotoKtp
  // )

  app.get(
    "/user/:id", 
    UserController.getDataById
  );
};
