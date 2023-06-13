const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation
function validateNewTable(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "Request body data is missing",
    });
  }

  const { table_name, capacity } = req.body.data;

  if (table_name === null || table_name === undefined) {
    next({
      status: 400,
      message: "table_name is missing",
    });
  }

  if (table_name.length === 0) {
    next({
      status: 400,
      message: "table_name is empty",
    });
  }

  if (table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be at least two characters",
    });
  }

  if (capacity === null || capacity === undefined) {
    next({
      status: 400,
      message: "Table capacity is missing",
    });
  }

  if (capacity < 1) {
    next({
      status: 400,
      message: "Table capacity must be at least one",
    });
  }

  if (typeof capacity !== "number") {
    next({
      status: 400,
      message: "Received NaN for table capacity",
    });
  }

  res.locals.newTable = {
    table_name,
    capacity,
  };

  return next();
}

function validateSeatRequest(req, res, next) {
  console.log("validateSeatRequest");
  const { people, capacity } = res.locals;

  if (people > capacity) {
    next({
      error: 400,
      message: "Reservation has too many guests for this table",
    });
  }

  return next();
}

// Operations
async function validateReservation(req, res, next) {
  console.log("validateReservation");

  if (req.body.data === null || req.body.data === undefined) {
    next({
      status: 400,
      message: "Request body data is missing",
    });
  }

  if (!req.body.data.reservation_id) {
    next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  const { reservation_id } = req.body.data;

  try {
    const response = await service.readReservation(reservation_id);
    res.locals.people = response;
    return next();
  } catch (error) {
    console.log("reservation_id does not exist", error);
    next({ status: 404, message: error.message });
  }

  return next();
}

async function validateTable(req, res, next) {
  console.log("validateTable");
  const { table_id } = req.params;

  try {
    const response = await service.readTable(table_id);
    res.locals.table = response;
    return next();
  } catch (error) {
    console.log("table does not exist", error);
    next({ status: 404, message: error.message });
  }
}

async function list(req, res) {
  console.log("tables -> list");
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  console.log("tables -> create:");
  const data = await service.create(res.locals.newTable);
  res.status(201).json({ data });
}

async function update(req, res) {
  console.log("tables -> update");
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;

  const data = await service.update(reservation_id, table_id);
  res.sendStatus(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateNewTable, asyncErrorBoundary(create)],
  update: [
    validateReservation,
    validateTable,
    validateSeatRequest,
    asyncErrorBoundary(update),
  ],
};
