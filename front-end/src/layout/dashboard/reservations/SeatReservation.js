import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { seatReservation } from "../../../utils/api";

import ErrorAlert from "../../../utils/ErrorAlert";

import "./SeatReservation.css";

export default function Seat({
  reservations,
  reservationsError,
  setReservationsChange,
  tables,
  tablesError,
  setTablesChange,
}) {
  const reservationPathId = parseInt(useParams().reservation_id);
  const initialFormData = { table_id: "", reservation_id: reservationPathId };

  // Hooks
  const [formData, setFormData] = useState(initialFormData);
  const [seatingError, setSeatingError] = useState(null);
  const history = useHistory();

  // Handlers
  async function handleSubmit(event) {
    event.preventDefault();
    setSeatingError(null);

    try {
      await seatReservation(formData);
      setReservationsChange(new Date());
      setTablesChange(new Date());
      history.push("/");
    } catch (error) {
      console.log(error);
      setSeatingError(error);
    }
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleCancel(event) {
    event.preventDefault();
    history.push("/dashboard");
  }

  // Grabs the reservation to be seated from the array of reservations
  const reservation = reservations.find((reservation) => {
    return reservation.reservation_id === reservationPathId;
  });

  // JSX

  /* The top part displays either the reservation being seated or
   an error alert. The other part displays a dropdown for selecting
   which table to seat the reservation at or an error if a problem exists
   getting the tables. 
  */
  return (
    <>
      <h1>Seating reservation:</h1>
      {!reservation ? (
        <div>
          <ErrorAlert error={reservationsError} />
        </div>
      ) : (
        <div className="seatFormContainer">
          <h2>
            {reservation.last_name}, {reservation.first_name}
          </h2>
          <h4>{reservation.reservation_date}</h4>
          <h4>{reservation.reservation_time}</h4>
          <p>Party of {reservation.people}</p>
        </div>
      )}

      {!tablesError ? (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="table_id"></label>
            <select
              name="table_id"
              id="table_id"
              value={formData.table_id}
              onChange={handleChange}
            >
              <option value="">Select a table</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                );
              })}
            </select>
            <button type="submit">Submit</button>
            <button onClick={handleCancel}>Cancel</button>
          </form>
          {seatingError ? <ErrorAlert error={seatingError} /> : null}
        </div>
      ) : (
        <ErrorAlert error={tablesError} />
      )}
    </>
  );
}
