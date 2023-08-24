import React from "react";

export default function Table({
  table: { table_id, table_name, capacity, reservation_id },
  handleFinish,
}) {
  return (
    <>
      <h4>{table_name}</h4>
      <p>Capacity: {capacity}</p>
      {reservation_id ? (
        <p data-table-id-status={`${table_id}`}>Occupied</p>
      ) : (
        <p data-table-id-status={`${table_id}`}>Free</p>
      )}
      <button
        onClick={handleFinish}
        data-table-id-finish={table_id}
        id={table_id}
      >
        Finish
      </button>
    </>
  );
}
