const knex = require("../db/connection");

function readReservation(reservation_id) {
  return knex("reservations")
    .first(["people", "status"])
    .where({ reservation_id });
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

/*
   Seats a reservation using a transaction,
   which performs both queries using the same connection
*/
function update(reservation_id, table_id) {
  return knex
    .transaction(function (trx) {
      return trx("tables")
        .update({ reservation_id })
        .where({ table_id })
        .then(() => {
          return trx("reservations")
            .update("status", "seated")
            .where({ reservation_id })
            .returning(["reservation_id", "status"])
            .then((updatedRecords) => updatedRecords[0]);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

/* 
  Doesn't actually delete a record, just frees a table when a reservation finishes
  First grabs the reservation id because I couldn't figure out
  how to transfer it within the transaction,
  then runs a transaction to ensure tables and reservations are synced
  */
async function destroy(table_id) {
  const { reservation_id } = await readTable(table_id);

  return knex
    .transaction(function (trx) {
      return trx("tables")
        .update("reservation_id", null)
        .where({ table_id })
        .then(function () {
          return trx("reservations")
            .update("status", "finished")
            .where({ reservation_id })
            .returning(["reservation_id", "status"])
            .then((updatedRecords) => updatedRecords[0]);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = { readReservation, readTable, list, create, update, destroy };
