import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";

import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";

import Dashboard from "./dashboard/Dashboard";
import CreateReservation from "./dashboard/reservations/CreateReservation";
import TableForm from "./dashboard/tables/TableForm";
import Seat from "./dashboard/reservations/SeatReservation";
import Search from "./dashboard/search/Search";
import EditReservation from "./dashboard/reservations/EditReservation";
import NotFound from "./NotFound";

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
  const [reservationsChange, setReservationsChange] = useState(new Date());
  const [reservationsError, setReservationsError] = useState(null);

  const loadReservations = () => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  useEffect(loadReservations, [date, reservationsChange]);

  const [tables, setTables] = useState([]);
  const [tablesChange, setTablesChange] = useState(new Date());
  const [tablesError, setTablesError] = useState(null);
  const [lastPath, setLastPath] = useState("");

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

  useEffect(() => {
    setLastPath(history.location.pathname);
  }, [history.location.pathname]);

  const goYesterday = () => {
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const goTomorrow = () => {
    history.push(`/dashboard?date=${next(date)}`);
  };

  const goToday = () => {
    history.push(`/dashboard`);
  };

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
          goYesterdayHandler={goYesterday}
          goTomorrowHandler={goTomorrow}
          goTodayHandler={goToday}
          reservations={reservations}
          setReservationsChange={setReservationsChange}
          reservationsError={reservationsError}
          tables={tables}
          setTablesChange={setTablesChange}
          tablesError={tablesError}
        />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation setReservationsChange={setReservationsChange} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat
          reservations={reservations}
          setReservationsChange={setReservationsChange}
          reservationsError={reservationsError}
          tables={tables}
          setTablesChange={setTablesChange}
        />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation
          lastPath={lastPath}
          setReservationsChange={setReservationsChange}
        />
      </Route>
      <Route path="/tables/new">
        <TableForm setTablesChange={setTablesChange} />
      </Route>
      <Route exact path="/search">
        <Search
          setReservationsChange={setReservationsChange}
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
