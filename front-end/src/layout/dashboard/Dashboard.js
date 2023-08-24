import React from "react";

import Reservations from "./reservations/Reservations";
import Tables from "./tables/Tables";
import ErrorAlert from "../../utils/ErrorAlert";

import "./Dashboard.css";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  goYesterdayHandler,
  goTomorrowHandler,
  goTodayHandler,
  reservations,
  setReservationsChange,
  reservationsError,
  tables,
  setTablesChange,
  tablesError,
}) {
  // JSX
  return (
    <main>
      <h1>Dashboard</h1>
      <hr></hr>
      <button onClick={goTodayHandler}>Today</button>
      <button onClick={goYesterdayHandler}>Previous</button>
      <button onClick={goTomorrowHandler}>Next</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      {reservationsError ? (
        <ErrorAlert error={reservationsError} />
      ) : (
        <Reservations
          reservations={reservations}
          setReservationsChange={setReservationsChange}
          setTablesChange={setTablesChange}
        />
      )}
      <hr></hr>
      {tablesError ? (
        <ErrorAlert error={tablesError} />
      ) : (
        <Tables
          tables={tables}
          setTablesChange={setTablesChange}
          setReservationsChange={setReservationsChange}
        />
      )}
    </main>
  );
}

export default Dashboard;
