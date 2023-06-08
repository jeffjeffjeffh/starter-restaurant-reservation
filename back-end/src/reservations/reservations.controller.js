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

// Validation
function hasValidReservationData(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  if (first_name.length < 1) {
    next({
      status: 400,
      message: `First name field is empty`,
    });
  }

  if (last_name.length < 1) {
    next({
      status: 400,
      message: `Last name field is empty`,
    });
  }

  if (mobile_number.length < 1) {
    next({
      status: 400,
      message: `Mobile number field is empty`,
    });
  }

  if (people < 0) {
    next({
      status: 400,
      message: `Reservation cannot be created with less than 1 person`,
    });
  }

  try {
    validateTime(reservation_time);
    validateDate(reservation_date);
    dayIsNotTuesday(reservation_date);
  } catch (error) {
    console.log(error);
    next({
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

// Operations
async function list(req, res, next) {
  const { date } = req.query;
  const data = await service.read(date);

  if (data.length != 0) {
    res.json({
      data,
    });
  } else {
    next({
      status: 404,
      message: `No reservations found for ${date}`,
    });
  }
}

async function create(req, res) {
  const { reservation } = res.locals;

  const response = await service.create(reservation);

  res.status(201).json({
    data: response,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasValidReservationData, asyncErrorBoundary(create)],
};
