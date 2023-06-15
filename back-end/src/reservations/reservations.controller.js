/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  validateDate,
  validateTime,
  dayIsNotTuesday,
} = require("../errors/dateTimeErrors");

// Helpers
// 1987-06-01
function isDate(date) {
  if (
    typeof date != "string" ||
    date.length != 10 ||
    date[4] != "-" ||
    date[7] != "-"
  ) {
    return false;
  } else {
    return true;
  }
}

// HH:MM
function isTime(time) {
  if (typeof time != "string" || time.length != 5 || time[2] != ":") {
    return false;
  } else {
    return true;
  }
}

// Validation
function hasValidReservationData(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Request data missing",
    });
  }

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  if (!first_name) {
    return next({
      status: 400,
      message: "first_name field is missing",
    });
  }

  if (first_name.length < 1) {
    return next({
      status: 400,
      message: `first_name field is empty`,
    });
  }

  if (!last_name) {
    return next({
      status: 400,
      message: "last_name field is missing",
    });
  }

  if (last_name.length < 1) {
    return next({
      status: 400,
      message: "last_name field is empty",
    });
  }

  if (!mobile_number) {
    return next({
      status: 400,
      message: "mobile_number field is missing",
    });
  }

  if (mobile_number.length < 1) {
    return next({
      status: 400,
      message: `mobile_number field is empty`,
    });
  }

  if (reservation_date === null || reservation_date === undefined) {
    return next({
      status: 400,
      message: "reservation_date field is missing",
    });
  }

  if (!isDate(reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date field is not of type date",
    });
  }

  if (reservation_date.length < 1) {
    return next({
      status: 400,
      message: "reservation_date field is empty",
    });
  }

  if (reservation_time === null || reservation_time === undefined) {
    return next({
      status: 400,
      message: "reservation_time field is missing",
    });
  }

  if (reservation_time.length < 0) {
    return next({
      status: 400,
      message: "reservation_time field is empty",
    });
  }

  if (!isTime(reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time field is not of type time",
    });
  }

  if (people === null || people === undefined) {
    return next({
      status: 400,
      message: "people field is missing",
    });
  }

  if (typeof people !== "number") {
    return next({
      status: 400,
      message: "Received NaN for people field",
    });
  }

  if (people <= 0) {
    return next({
      status: 400,
      message: `Number of people cannot be less than 1`,
    });
  }

  try {
    validateTime(reservation_time);
    validateDate(reservation_date);
    dayIsNotTuesday(reservation_date);
  } catch (error) {
    console.log(error);
    return next({
      status: 400,
      message: error.message,
    });
  }

  const newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };

  res.locals.reservation = newReservation;

  return next();
}

/* This method is run when reading a reservation with a specific ID */
async function reservationExists(req, res, next) {
  const reservation_id = Number(req.params.reservation_id);

  try {
    const data = await service.read(reservation_id);
    if (data) {
      res.locals.reservation = data;
      return next();
    } else {
      return next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      });
    }
  } catch (error) {
    return next({
      status: 404,
      message: "There was a problem retrieving the reservation",
    });
  }
}

// Operations
async function create(req, res) {
  const { reservation } = res.locals;

  const data = await service.create(reservation);

  res.status(201).json({
    data,
  });
}

function read(req, res) {
  const { reservation } = res.locals;

  res.json({ data: reservation });
}

async function list(req, res, next) {
  const { date } = req.query;
  const data = await service.list(date);

  if (data) {
    res.json({
      data,
    });
  } else {
    return next({
      status: 404,
      message: `No reservations found for ${date}`,
    });
  }
}

module.exports = {
  create: [hasValidReservationData, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  list: [asyncErrorBoundary(list)],
};
