const UserController = require("../controller/user.controller");
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

  app.get(
    "/user/:id", 
    UserController.getDataById
  );
};
