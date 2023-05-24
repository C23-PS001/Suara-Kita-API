const UserDB = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment");

const register = async (req, res) => {
  try {
    const { nama, nik, tanggalLahir, email, password } = req.body;
    const id = nanoid(16);
    const hashedPass = await bcrypt.hashSync(password, 10);
    //Check the request data is already exist or no
    const cekDataByNik = await UserDB.query().where({ nik });
    if (cekDataByNik.length !== 0 && cekDataByNik !== []) {
      return res.status(409).send({
        error: true,
        message:
          "NIK anda sudah terdaftar, 1 email hanya boleh mendaftar 1 NIK saja!",
      });
    }
    const cekData = await UserDB.query().where({ email });
    if (cekData.length !== 0 && cekData !== []) {
      return res.status(409).send({
        error: true,
        message: "Akun anda sudah terdaftar",
      });
    }
    //If the data isn't exist
    await UserDB.query().insert({
      id,
      nama,
      nik,
      tanggalLahir,
      email,
      password: hashedPass,
    });
    return res.status(200).send({
      error: false,
      message: "User anda telah berhasil terdaftar",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await UserDB.query().where({ email });
    if (data.length === 0) {
      return res.status(404).send({
        error: true,
        message:
          "Email atau password anda tidak sesuai dengan data yang telah terdaftar.",
      });
    }

    const isPassValid = bcrypt.compareSync(password, data[0].password);
    if (!isPassValid) {
      return res.status(404).send({
        error: true,
        message:
          "Email atau password anda tidak sesuai dengan data yang telah terdaftar.",
      });
    }

    const JWTtoken = jwt.sign(
      {
        id: data[0].id,
        nama: data[0].nama,
        nik: data[0].nik,
        email: data[0].email,
        tanggalLahir: moment(data[0].tanggalLahir).format("D-MM-YYYY"),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // const res = h.response({
    //   error: false,
    //   message: "Login berhasil",
    //   token: JWTtoken,
    //   loginResult: [
    //     {
    //       id: data[0].id,
    //       nama: data[0].nama,
    //       nik: data[0].nik,
    //       tanggalLahir: moment(data[0].tanggalLahir).format("l"),
    //     },
    //   ],
    // });
    // res.code(200);
    // return res;
    return res.status(200).send({
      error: false,
      message: "Login berhasil",
      loginToken: JWTtoken,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

const getData = async (req, res) => {
  try {
    const result = await UserDB.query();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserDB.query()
      .select("id", "nama", "nik", "email", "tanggalLahir")
      .where({ id });
    if (result.length === 0 || result === []) {
      return res
        .status(404)
        .send({ error: true, message: "Data tidak terdaftar pada database" });
    }

    result[0].tanggalLahir = moment(result[0].tanggalLahir).format(
      "D MMMM YYYY"
    );

    return res.status(200).send({
      error: false,
      message: "Data berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getData,
  getDataById,
};
