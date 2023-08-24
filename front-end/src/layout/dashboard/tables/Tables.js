import React from "react";
import { useHistory } from "react-router-dom";

import { clearTable } from "../../../utils/api";

import Table from "./Table";

import "./Tables.css";

export default function Tables({
  tables,
  setTablesChange,
  setReservationsChange,
}) {
  // Hooks
  const history = useHistory();

  // Handlers
  async function handleFinish({ target }) {
    const confirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (confirm) {
      try {
        await clearTable(Number(target.id));
        setTablesChange(Date.now());
        setReservationsChange(Date.now());
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
        {tables.map((table) => (
          <li key={`table-${table.table_name}`}>
            <Table table={table} handleFinish={handleFinish} />
          </li>
        ))}
      </ol>
    </div>
  );
}
