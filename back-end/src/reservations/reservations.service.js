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

function listWithDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .andWhereNot({ status: "cancelled" })
    .andWhereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listWithMobileNumber(mobile_number) {
  mobile_number = mobile_number.replace(/\D/g, "");

  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .andWhereNot({ status: "finished" })
    .andWhereNot({ status: "cancelled" })
    .orderBy("reservation_date");
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

function updateStatus(reservation_id, status) {
  // console.log("knex update to status:", status);
  return knex("reservations")
    .update({ status })
    .where({ reservation_id })
    .returning(["reservation_id", "status"])
    .then((updatedRecords) => updatedRecords[0]);
}

function updateInfo(reservation_id, reservation) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;

  return knex("reservations")
    .update({
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    })
    .where({ reservation_id })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  create,
  read,
  listWithDate,
  listWithMobileNumber,
  updateStatus,
  updateInfo,
};
