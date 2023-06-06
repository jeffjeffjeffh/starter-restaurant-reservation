const knex = require("../db/connection");

function read(date) {
  return knex("reservations").select("*").where({ reservation_date: date });
}

module.exports = { read };
