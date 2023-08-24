import React from "react";

import { cancelReservation } from "../../../utils/api";

import Reservation from "./Reservation";

import "./Reservations.css";

export default function Reservations({
  reservations,
  setReservationsChange,
  setTablesChange,
}) {
  const handleCancel = async (event) => {
    event.preventDefault();

    const confirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirm) {
      const reservation_id = event.target.id;
      try {
        await cancelReservation(reservation_id);
        setReservationsChange(new Date());
        setTablesChange(new Date());
      } catch (error) {
        throw error;
      }
    }
  };

  if (Array.isArray(reservations)) {
    return (
      <ul>
        {reservations.map((reservation, index) => (
          <li key={index} className="reservationCard">
            <Reservation
              reservation={reservation}
              handleCancel={handleCancel}
            />
          </li>
        ))}
      </ul>
    );
  } else {
    return null;
  }
}
