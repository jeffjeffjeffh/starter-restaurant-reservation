const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/****************  Validation ***************/

// Runs first when creating a new table
function validateNewTable(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "Request body data is missing",
    });
  }

  const { table_name, capacity } = req.body.data;

  if (!table_name) {
    return next({
      status: 400,
      message: "table_name is missing",
    });
  }

  if (table_name.length === 0) {
    return next({
      status: 400,
      message: "table_name is empty",
    });
  }

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least two characters",
    });
  }

  if (!capacity) {
    return next({
      status: 400,
      message: "Table capacity is missing",
    });
  }

  if (capacity < 1) {
    return next({
      status: 400,
      message: "Table capacity must be at least one",
    });
  }

  if (typeof capacity !== "number") {
    return next({
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

// Runs when updating a table with a new reservation,
// after validating the reservation and table
function validateSeatRequest(req, res, next) {
  console.log("validateSeatRequest");
  const { people, capacity, reservation_id } = res.locals;

  if (reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is already occupied",
    });
  }

  console.log("people: ", people, "capacity: ", capacity);

  if (people > capacity) {
    console.log(true);
    return next({
      status: 400,
      message: "Reservation has too many guests for this table's capacity",
    });
  }

  console.log(false);

  return next();
}

// Runs first when updating a table with a reservation
async function validateReservation(req, res, next) {
  console.log("validateReservation");

  if (!req.body.data) {
    return next({
      status: 400,
      message: "Request body data is missing",
    });
  }

  if (!req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  const { reservation_id } = req.body.data;

  try {
    const response = await service.readReservation(reservation_id);
    if (response) {
      console.log("response", response);
      res.locals.people = response.people;
      console.log("res.locals.people: ", res.locals.people);
      return next();
    } else {
      return next({
        status: 404,
        message: `reservation_id ${reservation_id} does not exist`,
      });
    }
  } catch (error) {
    console.log(error);
    next({ status: 404, message: error.message });
  }

  return next();
}

// Runs second when updating a table with a reservation
async function validateTable(req, res, next) {
  console.log("validateTable");
  const { table_id } = req.params;

  try {
    const response = await service.readTable(table_id);
    if (response) {
      res.locals.capacity = response.capacity;
      res.locals.reservation_id = response.reservation_id;
      return next();
    } else {
      return next({
        status: 404,
        message: `table_id ${table_id} does not exist`,
      });
    }
  } catch (error) {
    console.log("error retrieving table", error);
    return next({ status: 404, message: error.message });
  }
}

/****************  Operations ***************/
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
  res.json({ data });
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
