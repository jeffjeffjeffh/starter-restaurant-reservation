import React from "react";

export default function Tables({ tables }) {
  // JSX
  if (!tables) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="tablesContainer">
        <ol>
          {tables.map((table) => {
            return (
              <li key={table.id}>
                <h2>{table.id}</h2>
                <h3>{table.capacity}</h3>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
