import React from "react";

export default function Reservation({
  reservation: {
    reservation_id,
    first_name,
    last_name,
    reservation_date,
    reservation_time,
    mobile_number,
    people,
    status,
    created_at,
    updated_at,
  },
  handleCancel,
}) {
  if (status === "finished") {
    return null;
  }

  return (
    <>
      <h1>
        Guest: {last_name}, {first_name}
      </h1>
      <h3>Date: {reservation_date}</h3>
      <h3>Time: {reservation_time}</h3>
      <p>Contact: {mobile_number}</p>
      <p>Number of Guests: {people}</p>
      <b data-reservation-id-status={reservation_id}>Status: {status}</b>
      <hr></hr>
      <p>
        <span className="smaller">Created: {created_at}</span>
      </p>
      <p>
        <span className="smaller">Last updated: {updated_at}</span>
      </p>
      <a href={`/reservations/${reservation_id}/edit`}>edit</a>
      {status === "seated" ? null : (
        <a id={reservation_id} href={`/reservations/${reservation_id}/seat`}>
          seat
        </a>
      )}
      <button
        onClick={handleCancel}
        data-reservation-id-cancel={reservation_id}
        id={reservation_id}
      >
        Cancel
      </button>
    </>
  );
}
