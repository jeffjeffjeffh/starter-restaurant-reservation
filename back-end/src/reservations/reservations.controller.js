/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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
      message: `No reservations found for date ${date}`
    })
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
