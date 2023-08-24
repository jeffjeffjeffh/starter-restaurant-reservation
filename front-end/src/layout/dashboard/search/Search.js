import React, { useState } from "react";

import Reservations from "../reservations/Reservations";
import SearchForm from "./SearchForm";
import ErrorAlert from "../../../utils/ErrorAlert";

import "./Search.css";

export default function Search({ setReservationsChange, setTablesChange }) {
  const [filteredReservations, setFilteredReservations] = useState([]);

  // console.log(filteredReservations);

  return (
    <div className="searchContainer">
      <SearchForm setFilteredReservations={setFilteredReservations} />
      <hr />
      {filteredReservations.length ? (
        <Reservations
          reservations={filteredReservations}
          setReservationsChange={setReservationsChange}
          setTablesChange={setTablesChange}
        />
      ) : (
        <ErrorAlert
          error={new Error(`No reservations found for the number you entered.`)}
        />
      )}
    </div>
  );
}
