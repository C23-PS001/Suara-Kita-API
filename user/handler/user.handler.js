const UserDB = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment");

const register = async (req, h) => {
  try {
    const { nama, nik, tanggalLahir, email, password } = req.payload;

    const id = nanoid(16);
    const hashedPass = await bcrypt.hashSync(password, 10);

    //Check the request data is already exist or no
    const cekDataByNik = await UserDB.query().where({ nik });
    if (cekDataByNik.length !== 0 && cekDataByNik !== []) {
      const res = h.response({
        error: true,
        message:
          "NIK anda sudah terdaftar, 1 email hanya boleh mendaftar 1 NIK saja!",
      });
      res.code(500);
      return res;
    }

    const cekData = await UserDB.query().where({ email });
    if (cekData.length !== 0 && cekData !== []) {
      const res = h.response({
        error: true,
        message: "User sudah terdaftar sebelumnya",
      });
      res.code(500);
      return res;
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

    const res = h.response({
      error: false,
      message: "User anda telah berhasil terdaftar",
    });

    res.code(200);
    return res;
  } catch (error) {
    const res = h.response({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
    res.code(500);
    return res;
  }
};

const login = async (req, h) => {
  try {
    const { email, password } = req.payload;

    const data = await UserDB.query().where({ email });
    if (data.length === 0) {
      const res = h.response({
        error: true,
        message:
          "Email atau password anda tidak sesuai dengan data yang telah terdaftar.",
      });
      res.code(404);
      return res;
    }

    const isPassValid = bcrypt.compareSync(password, data[0].password);
    if (!isPassValid) {
      const res = h.response({
        error: true,
        message:
          "Email atau password anda tidak sesuai dengan data yang telah terdaftar.",
      });
      res.code(404);
      return res;
    }

    const JWTtoken = jwt.sign(
      {
        id: data[0].id,
        nama: data[0].nama,
        nik: data[0].nik,
        tanggalLahir: moment(data[0].tanggalLahir).format("l"),
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
    const res = h.response({
      error: false,
      message: "Login berhasil",
      loginToken: JWTtoken
    });
    res.code(200);
    return res;
  } catch (error) {
    const res = h.response({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
    res.code(500);
    return res;
  }
};

const getData = async (res, h) => {
  try {
    const result = await UserDB.query();

    res = h.response(result);
    res.code(200);
    return res;
  } catch (error) {
    res = h.response({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
    res.code(500);
    return res;
  }
};

const getDataById = async (req, h) => {
  try {
    const { id } = req.params;
    const result = await UserDB.query().select(
      'id',
      'nama',
      'nik',
      'email',
      'tanggalLahir',
    )
    .where({ id });
    if (result.length === 0 || result === []) {
      const res = h.response({
        error: true,
        message: "Data tidak terdaftar pada database",
      });
      res.code(500);
      return res;
    }

    result[0].tanggalLahir = moment(result[0].tanggalLahir).format("D MMMM YYYY");

    const res = h.response({
      error: false,
      message: "Data berhasil diambil",
      data: result,
    });
    res.code(200);
    return res;
  } catch (error) {
    const res = h.response({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
    res.code(500);
    return res;
  }
};

module.exports = {
  register,
  login,
  getData,
  getDataById,
};
