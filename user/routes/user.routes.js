const {
  register,
  login,
  getData,
  getDataById,
} = require("../handler/user.handler");

module.exports = function(app) {
  app.post(
    '/user/register',
    register
  )
  app.post(
    '/user/login',
    login
  )
  app.get(
    '/user',
    getData
  )

  app.get(
    '/user/:id',
    getDataById
  )
}

