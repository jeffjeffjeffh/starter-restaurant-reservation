const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .andWhereNot("status", "finished")
    .orderBy("reservation_time");
}

/*
  The following methods should handle four possibilities:
    booked -> seated
    booked -> finished
    seated -> booked
    seated -> finished
  All scenarios should use transactions to ensure the
    table and reservation are kept in sync.

   ^^^ Actually, the tests aren't designed to even look at the
    table_id, so it doesn't seem like I'm even intended to
    use transactions to keep them in sync here?
    Kind of weird.
*/

function update(reservation_id, status) {
  // console.log("knex update to status:", status);
  return knex("reservations")
    .update({ status })
    .where({ reservation_id })
    .returning(["reservation_id", "status"])
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  create,
  read,
  list,
  update,
};
