const UserDB = require("../model/user.model");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const { raw } = require("objection");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: "keys/nyobaaja-a78ca89fc3c5.json",
});
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink);


exports.register = async (req, res) => {
  try {
    const { nama, nik, tanggalLahir, email, password } = req.body;
    const id = nanoid(16);
    const hashedPass = await bcrypt.hashSync(password, 10);

    const newTglLahir = moment(tanggalLahir).format("YYYY-MM-DD");
    //Check the request data is already exist or no
    const cekDataByNik = await UserDB.query().where({ nik: raw("?", [nik]) });

    if (cekDataByNik.length !== 0 && cekDataByNik !== []) {
      return res.status(409).send({
        error: true,
        message:
          "NIK anda sudah terdaftar, 1 email hanya boleh mendaftar 1 NIK saja!",
      });
    }
    const cekData = await UserDB.query().where({ email: raw("?", [email]) });
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
      tanggalLahir: newTglLahir,
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

exports.uploadFotoKtp = async (req, res) => {
  
  try {
    
    const { fotoKtp } = req.file;
    console.log(req.file);
    const uuidKtp = uuidv4();
    const extnameKtp = path.extname(req.file.filename);
    const basenameKtp = path
      .basename(req.file.filename, extnameKtp)
      .trim()
      .split(" ")
      .join("-");

    const filenameKtp = `${uuidKtp}_${basenameKtp}${extnameKtp}`;
    // const pathFotoKtp = `fotoKtp/${filenameKtp}`;
    const bucket = "upload_foto";

    const urlFileKtp = `https://storage.googleapis.com/${bucket}/foto_ktp/${filenameKtp}`;
      await storage.bucket(bucket).upload(req.file.path, {
        destination: `foto_ktp/${filenameKtp}`,
      });
      await unlinkAsync(req.file.path);
    // file.mv(pathFotoKtp, async (err) => {
    //   if (err) {
    //     return res.status(500).send({
    //       error: true,
    //       message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
    //       errMessage: err.message,
    //     });
    //   }



    //   fs.unlink(pathFotoKtp, (err) => {
    //     if (err) {
    //       return res.status(500).send({
    //         error: true,
    //         message:
    //           "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
    //         errMessage: err.message,
    //       });
    //     }
    //   });
    // });

    // next()
    return res.status(200).send({
      error: false,
      message: "Foto berhasil terupload",
      link: urlFileKtp,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await UserDB.query().where({ email: raw("?", [email]) });
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
    return res.status(200).send({
      error: false,
      message: "Login berhasil",
      id: data[0].id,
      nama: data[0].nama,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserDB.query()
      .select("id", "nama", "nik", "email", "tanggalLahir")
      .where({ id: raw("?", [id]) });
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
