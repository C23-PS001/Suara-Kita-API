const jwt = require("jsonwebtoken");
const UserDB = require("../model/user.model");
const { raw } = require("objection");

exports.verifyJWT = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "Harap login terlebih dahulu!" });
  }

  await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    req.decoded_email = decoded.email;
    next();
  });
};

exports.isUserDataExist = async (req, res, next) => {
  try {
    const email = req.decoded_email;
    const getData = await UserDB.query().where({ email: raw("?", [email]) });
    if (getData.length === 0) {
      return res.status(200).send({
        message: "UNAUTHORIZED",
      });
    }

    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
