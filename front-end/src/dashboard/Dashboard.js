import React, { useEffect, useState } from "react";

import { listReservations, listTables } from "../utils/api";
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
}) {
  // State
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  // Effects
  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    async function loadTables() {
      setTablesError(null);
      try {
        const tablesFromApi = await listTables();
        setTables(tablesFromApi);
      } catch (error) {
        setTablesError(error);
      }
    }
    loadTables();
  }, []);

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
        <Reservations reservations={reservations} />
      )}
      <hr></hr>
      {tablesError ? (
        <ErrorAlert error={tablesError} />
      ) : (
        <Tables tables={tables} />
      )}
    </main>
  );
}

export default Dashboard;
