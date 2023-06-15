import React from "react";

import "./Reservations.css";

export default function Reservations({ reservations }) {
  if (Array.isArray(reservations)) {
    return reservations.map(
      ({
        reservation_id,
        first_name,
        last_name,
        reservation_date,
        reservation_time,
        mobile_number,
        people,
        created_at,
        updated_at,
      }) => {
        return (
          <div className="reservationCard" key={reservation_id}>
            <h1>
              Guest: {last_name}, {first_name}
            </h1>
            <h3>Date: {reservation_date}</h3>
            <h3>Time: {reservation_time}</h3>
            <p>Contact: {mobile_number}</p>
            <p>Number of Guests: {people}</p>
            <hr></hr>
            <p>
              <span className="smaller">Created: {created_at}</span>
            </p>
            <p>
              <span className="smaller">Last updated: {updated_at}</span>
            </p>
            <a
              id={reservation_id}
              href={`/reservations/${reservation_id}/seat`}
            >
              seat
            </a>
          </div>
        );
      }
    );
  } else {
    return null;
  }
}
