const tables = require("./01-tables.json");

exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE tables CASCADE").then(function () {
    return knex("tables").insert(tables);
  });
};
