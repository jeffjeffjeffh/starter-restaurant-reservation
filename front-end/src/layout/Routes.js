import React, { useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
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
  // The date is governed by the state of the date query param
  const search = useLocation().search;
  let dateFromPath = new URLSearchParams(search).get("date");
  if (!dateFromPath) {
    dateFromPath = today();
  }

  const [date, setDate] = useState(dateFromPath);

  // Buttons handlers to navigate to different dates,
  // passed into Dashboard component
  const history = useHistory();

  function previousDate() {}

  function nextDate() {}

  function todayDate() {
    history.push(`/dashboard?date=${today()}`);
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
