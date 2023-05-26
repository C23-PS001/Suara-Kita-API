const UserController = require("../controller/user.controller");
const middleware = require('../middleware/user.middleware')
const validation = require("../validation/user.validation");

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

  app.post(
    '/test/upload',
    validation.uploadFotoValidation, validation.runValidation, 
    UserController.uploadFotoKtp
  )
  
  //ONLY FOR TESTING PURPOSES NOT FOR END-USER
  app.get(
    "/user", 
    middleware.verifyJWT, middleware.isUserDataExist,
    UserController.getData
  );

  app.get(
    "/user/:id", 
    UserController.getDataById
  );
};
