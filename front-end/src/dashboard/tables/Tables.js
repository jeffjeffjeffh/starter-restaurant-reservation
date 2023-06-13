import React from "react";

import "./Tables.css";

export default function Tables({ tables }) {
  // JSX
  if (!tables) {
    return <p>Loading...</p>;
  } else {
    // Tables need to be displayed sorted by table name
    tables.sort((a, b) => {
      if (a.table_name.toLowerCase() > b.table_name.toLowerCase()) {
        return 1;
      } else if (a.table_name.toLowerCase() < b.table_name.toLowerCase()) {
        return -1;
      } else {
        return 0;
      }
    });

    return (
      <div className="tablesContainer">
        <h1>Tables</h1>
        <ol>
          {tables.map((table) => {
            return (
              <li key={table.table_id}>
                <h4>{table.table_name}</h4>
                <p>Capacity: {table.capacity}</p>
                {table.reservation_id ? (
                  <p data-table-id-status={`${table.table_id}`}>Occupied</p>
                ) : (
                  <p data-table-id-status={`${table.table_id}`}>Free</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
