import React from "react";

import ErrorAlert from "../utils/ErrorAlert";

import Reservations from "./reservations/Reservations";
import Tables from "./tables/Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  previousDateHandler,
  nextDateHandler,
  todayHandler,
  reservations,
  reservationsError,
  setReservationsChange,
  tables,
  tablesError,
  setTablesChange,
}) {
  // State

  // Effects

  // JSX
  return (
    <main>
      <h1>Dashboard</h1>
      <hr></hr>
      <button onClick={todayHandler}>Today</button>
      <button onClick={previousDateHandler}>Previous</button>
      <button onClick={nextDateHandler}>Next</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      {reservationsError ? (
        <ErrorAlert error={reservationsError} />
      ) : (
        <Reservations reservations={reservations} tables={tables} />
      )}
      <hr></hr>
      {tablesError ? (
        <ErrorAlert error={tablesError} />
      ) : (
        <Tables tables={tables} setTablesChange={setTablesChange} setReservationsChange={setReservationsChange} />
      )}
    </main>
  );
}

export default Dashboard;
