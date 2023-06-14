const knex = require("../db/connection");

function readReservation(reservation_id) {
  return knex("reservations").first("people").where({ reservation_id });
}

function readTable(table_id) {
  return knex("tables").first("capacity", "reservation_id").where({ table_id });
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(reservation_id, table_id) {
  return knex("tables")
    .update({ reservation_id })
    .where({ table_id })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = { readReservation, readTable, list, create, update };
