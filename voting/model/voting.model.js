const { Model } = require("objection");
const knex = require("../../config/knex");

Model.knex(knex);

class Voting extends Model {
  static get tableName() {
    return "voting";
  }
}

module.exports = Voting;
