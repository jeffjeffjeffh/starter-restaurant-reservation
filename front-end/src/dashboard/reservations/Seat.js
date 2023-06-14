import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { seatReservation } from "../../utils/api";
import ErrorAlert from "../../utils/ErrorAlert";

import "./Seat.css";

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

  const [formData, setFormData] = useState(initialFormData);

  const history = useHistory();

  function handleSubmit(event) {
    event.preventDefault();
    try {
      seatReservation(formData);
      setReservationsChange(Date.now());
      setTablesChange(Date.now());
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleCancel(event) {
    history.push("/dashboard");
  }

  const reservation = reservations.find((reservation) => {
    return reservation.reservation_id === reservationPathId;
  });

  return (
    <>
      <h1>Seating reservation:</h1>
      {!reservation ? (
        <div>
          <ErrorAlert error={reservationsError} />
          <button onClick={handleCancel}>Cancel</button>
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
        </form>
      ) : (
        <ErrorAlert error={tablesError} />
      )}
    </>
  );
}
