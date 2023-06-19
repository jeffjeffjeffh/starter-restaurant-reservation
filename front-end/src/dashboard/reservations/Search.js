import React, { useState } from "react";

import Reservations from "./Reservations";
import SearchForm from "./SearchForm";

import ErrorAlert from "../../utils/ErrorAlert";

export default function Search() {
  const [filteredReservations, setFilteredReservations] = useState([]);

  console.log(filteredReservations);

  return (
    <div>
      <SearchForm setFilteredReservations={setFilteredReservations} />
      {filteredReservations.length ? (
        <Reservations reservations={filteredReservations} />
      ) : (
        <ErrorAlert
          error={new Error(`No reservations found for the number you entered.`)}
        />
      )}
    </div>
  );
}
