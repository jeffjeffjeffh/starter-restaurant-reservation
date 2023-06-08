const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Validation
function validateNewTable(req, res, next) {
  const { table_id, capacity } = req.body.data;

  if (table_id === null || table_id === undefined) {
    next({
      status: 400,
      message: "Table name is missing",
    });
  }

  if (table_id.length < 2) {
    next({
      status: 400,
      message: "Table name must be at least two characters",
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

  res.locals.newTable = {
    table_id,
    capacity,
  };

  return next();
}

// Operations
async function list(req, res) {
  console.log("tables -> list");
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  console.log("tables -> create:");
  const data = await service.create(res.locals.newTable);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateNewTable, asyncErrorBoundary(create)],
};
