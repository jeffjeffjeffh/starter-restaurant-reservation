function methodNotAllowed(req, res, next) {
  next({
    status: 405,
    message: `${req.method} not allowed on path ${req.originalUrl}`,
  });
}

module.exports = methodNotAllowed;
