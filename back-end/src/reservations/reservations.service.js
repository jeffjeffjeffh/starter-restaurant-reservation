const knex = require("../db/connection");

function read(date) {
  return knex("reservations").select("*").where({ reservation_date: date });
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*");
}

module.exports = { read, create };
