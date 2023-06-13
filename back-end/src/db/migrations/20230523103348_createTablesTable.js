exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.text("table_name");
    table.integer("capacity");
    table.integer("reservation_id").unsigned();
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations")
      .onDelete("cascade");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
