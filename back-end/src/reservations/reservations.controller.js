/**
 * List handler for reservation resources
 */

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function validateDate(req, res, next) {
  const { date } = req.query;
  console.log(date);
  return next();
}

async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list: [validateDate, asyncErrorBoundary(list)],
};
