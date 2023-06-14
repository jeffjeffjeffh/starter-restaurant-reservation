import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import { listReservations, listTables } from "../utils/api";

import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../dashboard/reservations/ReservationForm";
import TableForm from "../dashboard/tables/TableForm";
import Seat from "../dashboard/reservations/Seat";

import NotFound from "./NotFound";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // The date is governed by the state of the date query param,
  // and is assigned today's date by default
  const location = useLocation();
  let dateFromPath = new URLSearchParams(location.search).get("date");
  if (!dateFromPath) {
    dateFromPath = today();
  }

  const [date, setDate] = useState(dateFromPath);
  useEffect(() => {
    setDate(dateFromPath);
  }, [dateFromPath]);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationsChange, setReservationsChange] = useState(false);

  useEffect(loadDashboard, [date, reservationsChange]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tablesChange, setTablesChange] = useState(false);

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
  }, [tablesChange]);

  // Buttons handlers to navigate to different dates,
  // passed into the Dashboard component
  const history = useHistory();

  function goPreviousDate() {
    history.push(`/dashboard?date=${previous(date)}`);
  }

  function goNextDate() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  function goTodayDate() {
    history.push(`/dashboard`);
  }

  // Return
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={`/dashboard`} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          previousDateHandler={goPreviousDate}
          nextDateHandler={goNextDate}
          todayHandler={goTodayDate}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
        />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm
          setReservationsChange={setReservationsChange}
        />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          setTablesChange={setTablesChange}
        />
      </Route>
      <Route path="/tables/new">
        <TableForm
          setTablesChange={setTablesChange}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
