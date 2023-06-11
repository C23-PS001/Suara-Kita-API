const VotingDB = require("../model/voting.model");
const UserDB = require("../../user/model/user.model");
const { raw } = require("objection");

exports.getVotingCount = async (req, res) => {
  try {
    const dataCandidate1 = await VotingDB.query()
      .count("* as result")
      .where("candidateNum", "1");

    const dataCandidate2 = await VotingDB.query()
      .count("* as result")
      .where("candidateNum", "=", "2");

    return res.status(200).send({
      error: false,
      message: "Data berhasil diambil",
      candidate1: dataCandidate1[0].result,
      candidate2: dataCandidate2[0].result,
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: err.message,
    });
  }
};

exports.doVoting = async (req, res) => {
  try {
    const { idUser, candNum } = req.body;

    const userData = await UserDB.query().where({ id: raw("?", [idUser]) });
    if (userData.length === 0) {
        return res.status(200).send({
            error: true,
            message: 'Data anda tidak terdaftar!'
        })

    }

    //If the ML verification is success and the verified value is updated in server

    // if(userData[0].verified === 0){
    //     return res.status(200).send({
    //         error: true,
    //         message: 'Saat ini, anda belum dapat melakukan pemilihan'
    //     })
    // }


    if (candNum < 1 || candNum > 2) {
      return res.status(200).send({
        error: true,
        message: "Silahkan memilih sesuai pada pilihan yang sudah tersedia!",
      });
    }

    if (userData[0].isVoted === 1) {
      return res.status(406).send({
        error: true,
        message: "Anda hanya diperkenankan memilih sekali saja",
      });
    }

    await VotingDB.query().insert({
      idUser,
      candidateNum: candNum,
    });

    await UserDB.query()
      .update({
        isVoted: 1,
      })
      .where({ id: raw("?", [idUser]) });

    return res.status(200).send({
      error: false,
      message: "Pemilihan berhasil",
    });
  } catch (err) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: err.message,
    });
  }
};

exports.isUserVote = async (req, res) => {
  try {
    const { nik } = req.params;
    const userDbResult = await UserDB.query()
      .select("isVoted", "id")
      .where({ nik: raw("?", [nik]) });

    if (userDbResult.length === 0 || userDbResult === []) {
      return res.status(200).send({
        isVoted: true,
        dataExist: false,
      });
    }

    const voteDbResult = await VotingDB.query().where({
      idUser: raw("?", [userDbResult[0].id]),
    });

    if (userDbResult[0].isVoted == 0 && voteDbResult.length === 0) {
      return res.status(200).send({
        isVoted: false,
        dataExist: true,
      });
    }

    return res.status(200).send({
      isVoted: true,
      dataExist: true,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};

exports.isUserVote = async (req, res) => {
  try {
    const { nik } = req.params;
    const userDbResult = await UserDB.query()
      .select("isVoted", "id")
      .where({ nik: raw("?", [nik]) });

   
    if (userDbResult.length === 0 || userDbResult === []) {
      return res.status(200).send({
        isVoted: true,
        dataExist: false,
      });
    }

    const voteDbResult = await VotingDB.query().where({ idUser: raw("?", [userDbResult[0].id]) })

    if (userDbResult[0].isVoted == 0 && voteDbResult.length === 0) {
      return res.status(200).send({
        isVoted: false,
        dataExist: true,
      });
    }

    return res.status(200).send({
      isVoted: true,
      dataExist: true,
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Mohon maaf, sedang ada kendala pada server. Mohon menunggu",
      errMessage: error.message,
    });
  }
};