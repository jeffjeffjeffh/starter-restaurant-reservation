import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
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
  const [date, setDate] = useState(today());
  console.log(date);

  const search = useLocation().search;

  useEffect(initializeDate, []);

  // Establish date
  function initializeDate() {
    let dateFromPath = new URLSearchParams(search).get("date");
    if (dateFromPath) {
      setDate(dateFromPath);
    }
  }

  // Buttons handlers to change date
  function previousDate() {
    setDate(previous(date));
  }

  function nextDate() {
    setDate(next(date));
  }

  function todayDate() {
    setDate(today());
  }

  // Return
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          previousDateHandler={previousDate}
          nextDateHandler={nextDate}
          todayHandler={todayDate}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
