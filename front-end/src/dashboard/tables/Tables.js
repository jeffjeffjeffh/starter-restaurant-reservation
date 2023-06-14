import React from "react";
import { useHistory } from "react-router-dom";
import { clearTable } from "../../utils/api";
import "./Tables.css";

export default function Tables({ tables, setTablesChange }) {
  // Hooks
  const history = useHistory();

  // Handlers
  async function handleFinish({ target }) {
    const confirm = window.confirm(
      "Is the table ready to seat new guests? This cannot be undone."
    );

    if (confirm) {
      try {
        await clearTable(Number(target.id));
        setTablesChange(Date.now());
        history.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  }

  // JSX
  if (!tables) {
    return <p>Loading...</p>;
  }

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
              <button
                onClick={handleFinish}
                data-table-id-finish={table.table_id}
                id={table.table_id}
              >
                Finish
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
