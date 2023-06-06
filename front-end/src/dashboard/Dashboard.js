import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../utils/ErrorAlert";

import Reservations from "./Reservations";

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

  // Effect
  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // Return
  return (
    <main>
      <h1>Dashboard</h1>
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
    </main>
  );
}

export default Dashboard;
